import pytest
from django.conf import settings
import requests

def test_giphy_api_is_loaded():
    """Verifica se a chave da API do Giphy está presente no settings."""
    assert settings.GIPHY_API_KEY is not None
    assert settings.GIPHY_API_KEY != ''


def test_giphy_api_key_format():
    """Verifica se a chave tem um formato mínimo esperado."""
    assert len(settings.GIPHY_API_KEY) == 32
    assert settings.GIPHY_API_KEY.startswith("SUA_API_KEY_AQUI")


def test_giphy_api_key_content():
    """Verifica se a chave não é um placeholder comum ou vazia"""
    blacklist = [
        '', 
        None, 
        'YOUR_API_KEY_HERE', 
        'change_me', 
        'your_api_key'
    ]
    key = getattr(settings, 'GIPHY_API_KEY', None)
    
    assert key not in blacklist, f"A GIPHY_API_KEY está com um valor inválido: {key}"
    assert len(key) > 10, "A chave parece ser curta demais para uma API Key da Giphy"


def test_giphy_connection_and_response_format():
    """Verifica se a conexão com a API do Giphy está funcionando e se a resposta tem o formato esperado."""
    api_key = settings.GIPHY_API_KEY
    url = f"https://api.giphy.com/v1/gifs/search?api_key={api_key}&q=funny&limit=1"
    response = requests.get(url)

    # Verifica se a resposta é válida
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert len(data["data"]) > 0
    assert data["data"][0]["type"] == "gif"
    assert "url" in data["data"][0]["images"]['original']


def test_giphy_api_key_is_functionally_valid():
    """Faz uma chamada mínima para validar a autenticação na Giphy"""
    url = f"https://api.giphy.com/v1/gifs/search?api_key={settings.GIPHY_API_KEY}&q=test&limit=1"
    response = requests.get(url)
    
    # Se a chave for inválida, a Giphy retorna 401 (Unauthorized) ou 403 (Forbidden)
    assert response.status_code == 200, f"A API Key foi rejeitada pela Giphy. Status: {response.status_code}"