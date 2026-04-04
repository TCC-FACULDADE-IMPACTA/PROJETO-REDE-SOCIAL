import pytest
from django.conf import settings

def test_giphy_api_is_loaded():
    """Verifica se a chave da API do Giphy está presente no settings."""
    assert settings.GIPHY_API_KEY is not None
    assert settings.GIPHY_API_KEY != ''

def test_giphy_api_key_format():
    """Verifica se a chave tem um formato mínimo esperado."""
    assert len(settings.GIPHY_API_KEY) == 32
    assert settings.GIPHY_API_KEY.startswith("API_KEY")

def test_giphy_api_key_content():
    """Verifica se a chave não e apenas o valor de exemplo ou 'placeholder'  """
    blacklist = ['API_KEY',]
    assert settings.GIPHY_API_KEY not in blacklist