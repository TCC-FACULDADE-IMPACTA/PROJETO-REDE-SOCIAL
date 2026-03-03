#Registro dos modelos para o Django Admin
from django.contrib import admin
from .models import Usuario, Credencial

admin.site.register(Usuario)
admin.site.register(Credencial)



