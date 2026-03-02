#Roteamento principal (inclui as rotas de 'api')

from django.contrib import admin
from django.urls import path, include

# Onde o projeto deve procurar para as URLs da API
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api_usuario.urls')),
]
