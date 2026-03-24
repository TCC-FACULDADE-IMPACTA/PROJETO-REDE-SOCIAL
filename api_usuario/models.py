#Tabelas 'usuarios' e 'credenciais'

from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=50)
    foto = models.ImageField(upload_to='perfil/', null=True, blank=True)
    username = models.CharField(max_length=150, unique=True)
    nascimento = models.DateField()

    class Meta:
        db_table = 'usuarios' # Força o nome da tabela no banco

class Credencial(models.Model):
    email = models.EmailField(max_length=50, unique=True)
    senha = models.CharField(max_length=255) # Aumentado para suportar o hash do bcrypt
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='credencial', db_column='id_usuarios') # Chave estrangeira para o usuário

    class Meta:
        db_table = 'credenciais' # Força o nome da tabela no banco

class TokenVerificacaoEmail(models.Model):
    token = models.CharField(max_length=255, unique=True)
    verificado = models.BooleanField(default=False)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='tokens_verificacao_email', db_column='id_usuarios') # Chave estrangeira para o usuário

    class Meta:
        db_table = 'tokens_verificacao_email' # Força o nome da tabela no banco