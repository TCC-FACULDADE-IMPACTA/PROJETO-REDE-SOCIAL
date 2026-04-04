from deep_translator import GoogleTranslator
import jwt
import requests
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from api_usuario.models import Usuario, Credencial
from .serializers import CriaPostSentimentoSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import PostSentimento



@api_view(['GET'])
def buscar_gifs(request):
    """ Fluxo: BUSCAR GIFS NO GIPHY (PUBLICO OU AUTENTICADO) """

    query_pt = request.query_params.get('q', '')  # Termo de busca para o GIF
    if not query_pt:
        return Response({'erro': 'O parâmetro "q" é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)


    try:
        # Traduz o termo de busca de português para inglês
        query_en = GoogleTranslator(source='pt', target='en').translate(query_pt)
        
        # Configurações da API do Giphy
        api_key = settings.GIPHY_API_KEY
        limit = 12 # Mostra 12 GIFs por vez

        url = f"https://api.giphy.com/v1/gifs/search?api_key={api_key}&q={query_en}&limit={limit}&rating=g"
        response = requests.get(url)
        response.raise_for_status()  # Verifica se a resposta foi bem-sucedida
        data = response.json()

        # Simplifica os dados dos GIFs
        gifs_simplificados = []
        for gif in data.get('data', []):
            images = gif.get('images', {})
            fixed_height = images.get('fixed_height', {})
            url_gif = fixed_height.get('url')

            gifs_simplificados.append({
                'id': gif['id'],
                'titulo': gif['title'],
                'url': url_gif
            })

        return Response({
            'termo_original': query_pt,   # O que o usuário digitou ("ex: animada")
            'termo_traduzido': query_en,  # O que o Giphy realmente buscou ("ex: excited")
            'resultados': gifs_simplificados
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'erro': f'Erro ao buscar GIFs: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)   
    except requests.HTTPError as e:
        return Response({'erro': f'Erro na API do Giphy: {e.response.status_code}'}, status=e.response.status_code)
    except requests.RequestException as e:
        return Response({'erro': f'Não foi possível conectar ao serviço de Giphy: {str(e)}'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    

@api_view(['POST'])
def criar_post(request):
    """ Fluxo: CRIAR POST COM GIF """
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
    
    serializer = CriaPostSentimentoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(usuario=usuario)  # Associa o post ao usuário autenticado 
        return Response({
            'mensagem': 'Seu sentimento foi criado com sucesso.',
            'post': serializer.data
        }, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)