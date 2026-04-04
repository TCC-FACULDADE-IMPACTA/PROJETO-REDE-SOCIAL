#Registro dos modelos para o Django Admin

from django.contrib import admin
from .models import Usuario, Credencial

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'username', 'nascimento')
    search_fields = ('nome', 'username')

@admin.register(Credencial)
class CredencialAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'usuario')
    search_fields = ('email',)
