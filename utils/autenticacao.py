import jwt
from functools import wraps
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from api_usuario.models import Usuario


def token_obrigatorio(func):
    @wraps(func)
    def decorador(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'erro': 'Token não fornecido.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token = auth_header.split(' ')[1]

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            usuario_id = payload.get('usuario_id')
            usuario = Usuario.objects.get(id=usuario_id)
            
            # Injetamos o usuário no objeto request para ser usado na view
            request.user_autenticado = usuario 
            
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, Usuario.DoesNotExist):
            return Response({'erro': 'Token inválido ou expirado.'}, status=status.HTTP_401_UNAUTHORIZED)

        return func(request, *args, **kwargs)

    return decorador