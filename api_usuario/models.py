#Tabelas 'usuarios' e 'credenciais'
import uuid
from django.utils import timezone
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
    magic_link_token = models.UUIDField(blank=True, null=True, unique=True)
    magic_link_expiracao = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'credenciais' # Força o nome da tabela no banco

    def __str__(self): # Representação em string do objeto
        return self.email
    
    def gerar_magic_link_token(self):
        """Gera um token único válido por 15 minutos"""
        self.magic_link_token = uuid.uuid4()
        self.magic_link_expiracao = timezone.now() + timezone.timedelta(minutes=15)
        self.save()
        return self.magic_link_token

    def limpar_magic_link_token(self):
        """Invalida o link após o uso seguro"""
        self.magic_link_token = None
        self.magic_link_expiracao = None
        self.save()
    