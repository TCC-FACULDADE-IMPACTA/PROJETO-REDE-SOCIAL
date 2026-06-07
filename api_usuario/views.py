from urllib import request
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from .models import Usuario, Credencial
from .serializers import CadastroSerializer, LoginSerializer, PerfilSerializer, FotoPerfilSerializer, EditarPerfilSerializer
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.parsers import MultiPartParser, FormParser
from utils.autenticacao import token_obrigatorio
import jwt
from datetime import datetime, timedelta, timezone 
from django.utils import timezone as django_timezone

# SE O MÉTODO FOR POST, PROCESSA O CADASTRO
@api_view(['POST'])
def cadastrar_usuario(request):
    """ Fluxo: CADASTRAR USUÁRIO """
    serializer = CadastroSerializer(data=request.data)
    
    if serializer.is_valid():
        data = serializer.validated_data
        
        try:
            # SISTEMA CRIA O USUÁRIO
            novo_usuario = Usuario.objects.create(
                nome=data['nome'],
                username=data['username'],
                nascimento=data['nascimento']
            )
            
            # CRIA A CREDENCIAL 
            Credencial.objects.create(
                email=data['email'],
                senha=make_password(data['senha']),
                usuario=novo_usuario
            )
            # RETORNA RESPOSTA DE SUCESSO
            return Response(
                {'mensagem': 'Usuário cadastrado com sucesso! Bem-vindo.'}, 
                status=status.HTTP_201_CREATED
            )   
        except Exception as e:
            print("Erro ao cadastrar usuário:", {str(e)})
            return Response({'erro': f'Erro interno: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# FLUXO DE LOGIN
@api_view(['POST'])
def efetuar_login(request):
    """ Fluxo: EFETUAR LOGIN """
    serializer = LoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # EXTRAÇÃO DOS DADOS VALIDADOS
    identificador = serializer.validated_data['login']
    senha = serializer.validated_data['senha']

    credencial = Credencial.objects.filter(email=identificador).first()
    
    if not credencial:
        # SE NÃO ACHOU POR E-MAIL, TENTA BUSCAR PELO USERNAME PRIMEIRO
        usuario = Usuario.objects.filter(username=identificador).first()
        if usuario:
            credencial = Credencial.objects.filter(usuario=usuario).first()

    # VALIDAR SENHA E GERAR TOKEN
    if credencial and check_password(senha, credencial.senha):
        payload = {
            'usuario_id': credencial.usuario.id,
            'username': credencial.usuario.username,
            'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            'iat': datetime.now(timezone.utc)
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    
        return Response({
            'mensagem': 'Login efetuado com sucesso!',
            'token': token,
            'user_id': credencial.usuario.id
        }, status=status.HTTP_200_OK)

    return Response(
        {'erro': 'Credenciais inválidas.'}, 
        status=status.HTTP_401_UNAUTHORIZED
    )

# FLUXO: VER PERFIL DO USUÁRIO
@api_view(['GET'])
@token_obrigatorio
def ver_perfil(request):
    """ Fluxo: VER PERFIL DO USUÁRIO """
    usuario = getattr(request, 'user_autenticado', None)

    if not usuario:
        return Response({"erro": "Usuário não identificado"}, status=401)

    usuario_atualizado = Usuario.objects.get(id=usuario.id)
    serializer = PerfilSerializer(usuario_atualizado, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# FLUXO: UPLOAD DE FOTO DE PERFIL
@api_view(['POST'])
@token_obrigatorio
@parser_classes([MultiPartParser, FormParser])
def upload_foto(request):
    """ Fluxo: UPLOAD DE FOTO DE PERFIL """
    usuario = request.user_autenticado

    if 'foto' not in request.FILES:
        return Response({'erro': 'Chave "foto" não encontrada nos arquivos enviados.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = FotoPerfilSerializer(usuario, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'mensagem': 'Foto de perfil atualizada com sucesso!',
            'foto_url': usuario.foto.url 
        }, status=status.HTTP_200_OK)
    
    print(f"ERROS DO SERIALIZER: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# FLUXO: ATUALIZAR PERFIL DO USUÁRIO
@api_view(['PATCH'])
@token_obrigatorio
@parser_classes([MultiPartParser, FormParser])
def atualizar_perfil(request):
    """ Fluxo: ATUALIZAR PERFIL DO USUÁRIO """
    usuario = getattr(request, 'user_autenticado', None)

    if not usuario:
        return Response({"erro": "Usuário não identificado"}, status=401)

    nova_bio = request.data.get('bio')
    nova_foto = request.FILES.get('foto')

    if nova_bio:
        usuario.bio = nova_bio
    
    if nova_foto:
        usuario.foto = nova_foto

    usuario.save()

    serializer = PerfilSerializer(usuario, context={'request': request})
    return Response(serializer.data, status=200)

# FLUXO: SOLICITAR MAGIC LINK
@api_view(['POST'])
def solicitar_magic_link(request):
    """ Gera o token UUID e dispara o e-mail real para o usuário """
    email_informado = request.data.get('email')
    if not email_informado:
        return Response({'erro': 'O e-mail é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        credencial = Credencial.objects.get(email=email_informado)
        token_uuid = credencial.gerar_magic_link_token()
        
        url_front = "http://localhost:5173"
        link_acesso = f"{url_front}/pages/esqueceu_senha/autenticar.html?token={token_uuid}"

        send_mail(
            'Seu Link de Acesso - Mood',
            f'Olá, {credencial.usuario.nome}!\n\nClique no link abaixo para entrar direto na sua conta sem senha:\n{link_acesso}\n\nEste link é de uso único e expira em 15 minutos.',
            settings.DEFAULT_FROM_EMAIL,
            [credencial.email],
            fail_silently=False,
        )

        return Response({'mensagem': 'Link de acesso enviado com sucesso para o seu e-mail!'}, status=status.HTTP_200_OK)

    except Credencial.DoesNotExist:
        return Response({'mensagem': 'Se o e-mail estiver cadastrado, um link foi enviado.'}, status=status.HTTP_200_OK)

# FLUXO: VERIFICAR MAGIC LINK
@api_view(['POST'])
def verificar_magic_link(request):
    """ Valida o UUID da URL, limpa o banco e entrega o Token JWT padrão """
    token_recebido = request.data.get('token')
    if not token_recebido:
        return Response({'erro': 'Token inválido ou ausente.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        credencial = Credencial.objects.get(
            magic_link_token=token_recebido,
            magic_link_expiracao__gt=django_timezone.now()
        )

        usuario = credencial.usuario

        payload = {
            'usuario_id': usuario.id,
            'username': usuario.username,
            'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            'iat': datetime.now(timezone.utc)
        }
        token_jwt = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        credencial.limpar_magic_link_token()

        return Response({
            'mensagem': 'Login efetuado via Link Mágico!',
            'token': token_jwt,
            'user_id': usuario.id
        }, status=status.HTTP_200_OK)

    except Credencial.DoesNotExist:
        return Response({'erro': 'Este link é inválido, já foi utilizado ou expirou.'}, status=status.HTTP_400_BAD_REQUEST)