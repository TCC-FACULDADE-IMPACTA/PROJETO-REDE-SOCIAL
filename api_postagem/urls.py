# ENDPOINTS DAS POSTAGENS
from django.urls import path
from . import views

urlpatterns = [
    path('api/buscar_gifs/', views.buscar_gifs, name='buscar_gifs'),
    path('api/criar_post/', views.criar_post, name='criar_post'),
    path('api/deletar_postagem/<int:post_id>/', views.deletar_postagem, name='deletar_postagem'),
    path('api/listar_postagens/', views.listar_postagens, name='listar_postagens'),
]