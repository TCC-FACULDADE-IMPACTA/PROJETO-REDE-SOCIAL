#Roteamento principal (inclui as rotas de 'api')

from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static

# Onde o projeto deve procurar as URLs da API
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api_usuario.urls')),
    path('', include('api_postagem.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)