import requests
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import CriaPostSentimentoSerializer
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
def buscar_gifs(request):
    """ Fluxo: BUSCAR GIFS NO GIPHY (PUBLICO OU AUTENTICADO) """

    query = request.query_params.get('q', '')  # Termo de busca para o GIF
    if not query:
        return Response({'erro': 'O parâmetro "q" é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

    # Configurações da API do Giphy
    api_key = settings.GIPHY_API_KEY
    limit = 12 # Mostra 12 GIFs por vez

    url = f"https://api.giphy.com/v1/gifs/search?api_key={api_key}&q={query}&limit={limit}&rating=g"

    try:
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
            'termo_buscado': query,
            'resultados': gifs_simplificados
        }, status=status.HTTP_200_OK)
    except requests.HTTPError as e:
        return Response({'erro': f'Erro na API do Giphy: {e.response.status_code}'}, status=e.response.status_code)
    except requests.RequestException as e:
        return Response({'erro': f'Não foi possível conectar ao serviço de Giphy: {str(e)}'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)