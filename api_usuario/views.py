import json
import jwt
import datetime
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from .models import Usuario, Credencial

@csrf_exempt
def cadastrar_usuario(request):
    """ Fluxo: CADASTRAR USUÁRIO """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Dados do Usuário e Credencial
            nome = data.get('nome')
            username = data.get('username')
            aniversario = data.get('aniversario')
            email = data.get('email')
            senha = data.get('senha')

            # VALIDAR DADOS
            if not all([nome, username, aniversario, email, senha]):
                return JsonResponse({'erro': 'Validação falhou. Preencha todos os campos.'}, status=400)

            # SISTEMA VERIFICA E-MAIL E @USERNAME NO BANCO
            username_existe = Usuario.objects.filter(username=username).exists()
            email_existe = Credencial.objects.filter(email=email).exists()

            if username_existe or email_existe:
                # SISTEMA NOTIFICA O USUÁRIO
                return JsonResponse({'erro': 'Username ou E-mail já cadastrado.'}, status=409)

            # SISTEMA CRIA HASH COM BCRYPT E SALVA NO BANCO
            # Cria o usuário primeiro
            novo_usuario = Usuario.objects.create(
                nome=nome,
                username=username,
                aniversario=aniversario
            )
            # Cria a credencial atrelada a ele com senha hasheada
            Credencial.objects.create(
                email=email,
                senha=make_password(senha), # Hash via Bcrypt
                usuario=novo_usuario
            )

            # SISTEMA REDIRECIONA PARA A TELA DE BOAS VINDAS
            return JsonResponse({'mensagem': 'Usuário cadastrado com sucesso! Bem-vindo.'}, status=201)
        # FIM DO FLUXO
        except Exception as e:
            return JsonResponse({'erro': f'Erro interno: {str(e)}'}, status=500)
        
    # Caso o método não seja POST
    return JsonResponse({'erro': 'Método não permitido.'}, status=405)


@csrf_exempt
def efetuar_login(request):
    """ Fluxo: EFETUAR LOGIN """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            identificador = data.get('login') or data.get('email') or data.get('username') # E-mail ou username
            senha = data.get('senha')

            # VALIDAR DADOS
            if not identificador or not senha:
                return JsonResponse({'erro': 'Dados incompletos.'}, status=400)

            # SISTEMA BUSCA USUARIO PELO E-MAIL E @USERNAME
            # Como estão em tabelas separadas, buscamos nas duas
            credencial = Credencial.objects.filter(email=identificador).first()
            if not credencial:
                usuario = Usuario.objects.filter(username=identificador).first()
                if usuario:
                    credencial = usuario.credencial

            # USUÁRIO LOCALIZADO?
            if credencial and check_password(senha, credencial.senha):
                # SIM: SISTEMA GERA TOKEN JWT E LIBERA ACESSO
                payload = {
                    'usuario_id': credencial.usuario.id,
                    'username': credencial.usuario.username,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
                    'iat': datetime.datetime.utcnow()
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

                # SISTEMA REDIRECIONA PARA A TELA DE BOAS VINDAS
                return JsonResponse({
                    'mensagem': 'Login efetuado com sucesso! Bem-vindo.',
                    'token': token
                }, status=200)
            else:
                # NÃO: SISTEMA NOTIFICA O USUARIO
                return JsonResponse({'erro': 'Usuário não localizado ou senha incorreta.'}, status=401)

        except Exception as e:
            return JsonResponse({'erro': f'Erro interno: {str(e)}'}, status=500)
            
    return JsonResponse({'erro': 'Método não permitido.'}, status=405)