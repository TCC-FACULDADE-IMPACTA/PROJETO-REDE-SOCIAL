from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from .models import Usuario, Credencial
from .serializers import CadastroSerializer, LoginSerializer
from django.conf import settings
from datetime import datetime, timedelta, timezone
import jwt

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