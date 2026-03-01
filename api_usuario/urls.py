# Endpoints: /api/cadastrar/ e /api/login

from django.urls import path
from . import views

urlpatterns = [
    path('api/cadastrar/', views.cadastrar_usuario, name='cadastrar'),
    path('api/login/', views.efetuar_login, name='login'),
]