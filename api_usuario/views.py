from urllib import request
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from .models import Usuario, Credencial
from .serializers import CadastroSerializer, LoginSerializer, PerfilSerializer, FotoPerfilSerializer
from django.conf import settings
from datetime import datetime, timedelta, timezone
import jwt
from rest_framework.parsers import MultiPartParser, FormParser

# SE O MÉTODO FOR POST, PROCESSA O CADASTRO
@api_view(['POST'])
def cadastrar_usuario(request):
    """ Fluxo: CADASTRAR USUÁRIO """

    # O SERIALIZER VALIDA OS DADOS
    serializer = CadastroSerializer(data=request.data)
    
    if serializer.is_valid():
        data = serializer.validated_data
        
        try:
            # SISTEMA CRIA O USUÁRIO
            novo_usuario = Usuario.objects.create(
                nome=data['nome'],
                username=data['username'],
                aniversario=data['aniversario']
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
        # SE HOUVER QUALQUER ERRO DURANTE O PROCESSO, RETORNA UM ERRO INTERNO    
        except Exception as e:
            return Response({'erro': f'Erro interno: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    # SE A VALIDAÇÃO FALHAR, RETORNA OS ERROS ESPECÍFICOS (EX: EMAIL INVÁLIDO)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# FLUXO DE LOGIN
@api_view(['POST'])
def efetuar_login(request):
    """ Fluxo: EFETUAR LOGIN """

    # VALIDA OS DADOS DO LOGIN
    serializer = LoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # EXTRAÇÃO DOS DADOS VALIDADOS
    identificador = serializer.validated_data['login']
    senha = serializer.validated_data['senha']

    # SISTEMA BUSCA USUÁRIO
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
            'exp': datetime.now(timezone.utc) + timedelta(hours=24), #TOKEN EXPIRA EM 24 HORAS
            'iat': datetime.now(timezone.utc)
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    
        return Response({
            'mensagem': 'Login efetuado com sucesso!',
            'token': token
        }, status=status.HTTP_200_OK)

    # FALHA NA AUTENTICAÇÃO
    return Response(
        {'erro': 'Credenciais inválidas.'}, 
        status=status.HTTP_401_UNAUTHORIZED
    )

# FLUXO: VER PERFIL DO USUÁRIO
@api_view(['GET'])
def ver_perfil(request):
    """ Fluxo: VER PERFIL DO USUÁRIO """
    
    auth_header = request.headers.get('Authorization')
    # VERIFICA SE O CABEÇALHO DE AUTORIZAÇÃO ESTÁ PRESENTE E COMEÇA COM 'Bearer '
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({'erro': 'Token de autenticação não fornecido.'}, status=status.HTTP_401_UNAUTHORIZED)
    # EXTRAINDO O TOKEN DO CABEÇALHO
    token = auth_header.split(' ')[1]

    # DECODIFICANDO O TOKEN PARA OBTENÇÃO DOS DADOS DO USUÁRIO
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        usuario_id = payload.get('usuario_id')
        usuario = Usuario.objects.get(id=usuario_id)
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, Usuario.DoesNotExist):
        return Response({'erro': 'Token inválido ou expirado.'}, status=status.HTTP_401_UNAUTHORIZED)

    # SE O USUÁRIO FOR ENCONTRADO, RETORNA OS DADOS DO PERFIL
    serializer = PerfilSerializer(usuario)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_foto(request):
    """ Fluxo: UPLOAD DE FOTO DE PERFIL """

    #testar porque no postman não está funcionando a injeção de arquivos
    # print(f"FILES recebidos: {request.FILES.keys()}") # Deve imprimir dict_keys(['foto'])
    # print(f"DATA recebido: {request.data}")

    # AUTENTICAÇÃO DO USUÁRIO (MESMO FLUXO DE VER PERFIL)
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({'erro': 'Token não fornecido.'}, status=status.HTTP_401_UNAUTHORIZED)

    token = auth_header.split(' ')[1]

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        usuario_id = payload.get('usuario_id')
        usuario = Usuario.objects.get(id=usuario_id)
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, Usuario.DoesNotExist):
        return Response({'erro': 'Token inválido ou expirado.'}, status=status.HTTP_401_UNAUTHORIZED)

    # VERIFICA SE O ARQUIVO 'foto' ESTÁ PRESENTE NOS FILES ENVIADOS
    if 'foto' not in request.FILES:
        return Response({'erro': 'Chave "foto" não encontrada nos arquivos enviados.'}, status=status.HTTP_400_BAD_REQUEST)

    # CRIAÇÃO DO SERIALIZER QUE VAI VALIDAR E SALVAR A FOTO
    serializer = FotoPerfilSerializer(usuario, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'mensagem': 'Foto de perfil atualizada com sucesso!',
            'foto_url': usuario.foto.url # Útil para o React atualizar a imagem
        }, status=status.HTTP_200_OK)
    
    # SE A VALIDAÇÃO FALHAR, RETORNA OS ERROS ESPECÍFICOS (EX: FORMATO DE IMAGEM INVÁLIDO)
    print(f"ERROS DO SERIALIZER: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
