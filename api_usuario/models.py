#Tabelas 'usuarios' e 'credenciais'

from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=50)
    foto = models.ImageField(upload_to='perfil/', null=True, blank=True)
    username = models.CharField(max_length=150, unique=True)
    nascimento = models.DateField()
    bio = models.TextField(max_length=500, null=True, blank=True)

    class Meta:
        db_table = 'usuarios' # Força o nome da tabela no banco

    def __str__(self): # Representação em string do objeto
        return self.username

class Credencial(models.Model):
    email = models.EmailField(max_length=50, unique=True)
    senha = models.CharField(max_length=255) # Aumentado para suportar o hash do bcrypt
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='credencial', db_column='id_usuarios') # Chave estrangeira para o usuário

    class Meta:
        db_table = 'credenciais' # Força o nome da tabela no banco

    def __str__(self): # Representação em string do objeto
        return self.email