# ENDPOINTS DAS POSTAGENS
from django.urls import path
from . import views

urlpatterns = [
    path('api/buscar_gifs/', views.buscar_gifs, name='buscar_gifs'),
]