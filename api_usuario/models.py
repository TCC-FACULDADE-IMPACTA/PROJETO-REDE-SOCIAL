#Tabelas 'usuarios' e 'credenciais'

from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=50)
    foto = models.BinaryField(null=True, blank=True) # bytea
    username = models.CharField(max_length=150, unique=True)
    aniversario = models.DateField()

    class Meta:
        db_table = 'usuarios' # Força o nome da tabela no banco

class Credencial(models.Model):
    email = models.EmailField(max_length=50, unique=True)
    senha = models.CharField(max_length=255) # Aumentado para suportar o hash do bcrypt
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='credencial', db_column='id_usuarios')

    class Meta:
        db_table = 'credenciais' # Força o nome da tabela no banco
