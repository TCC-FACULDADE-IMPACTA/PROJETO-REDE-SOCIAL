#TABELAS, COLUNAS E REGRAS DO BANCO DE DADOS

from django.db import models
from api_usuario.models import Usuario

class Postagem(models.Model):
    gif = models.BinaryField()
    descricao = models.TextField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='postagens', db_column='id_usuarios') # Chave estrangeira para o usuário

    class Meta:
        db_table = 'postagens' # Força o nome da tabela no banco