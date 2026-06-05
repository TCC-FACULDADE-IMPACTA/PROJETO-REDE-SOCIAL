#Registro dos modelos para o Django Admin

from django.contrib import admin
from .models import Usuario, Credencial
from django.utils.html import format_html

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'username', 'nascimento')
    search_fields = ('nome', 'username')
    readonly_fields = ('foto_preview',)

    def foto_preview(self, obj):
        if obj.foto:
            return format_html('<img src="{}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" />', obj.foto.url)
        return "Sem foto"

    # Nome que aparecerá no topo da coluna
    foto_preview.short_description = 'Foto'

@admin.register(Credencial)
class CredencialAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'usuario')
    search_fields = ('email',)

