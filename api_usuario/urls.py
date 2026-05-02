# Endpoints

from django.urls import path
from . import views

urlpatterns = [
    path('api/cadastrar/', views.cadastrar_usuario, name='cadastrar'),
    path('api/login/', views.efetuar_login, name='login'),
    path('api/perfil/', views.ver_perfil, name='ver_perfil'),
    path('api/upload_foto/', views.upload_foto, name='upload_foto'),
    path('api/atualizar_perfil/', views.atualizar_perfil, name='atualizar_perfil'),
]