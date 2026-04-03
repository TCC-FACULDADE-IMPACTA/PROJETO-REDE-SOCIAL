#TABELAS, COLUNAS E REGRAS DO BANCO DE DADOS
from django.db import models
from api_usuario.models import Usuario

class PostSentimento(models.Model):
    gif_url = models.URLField(max_length=500, blank=True, null=True) # URL do GIF, pode ser nula
    texto_sentimento = models.TextField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='postagens', db_column='id_usuarios') # Chave estrangeira para o usuário
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'postagens' # Força o nome da tabela no banco

    def __str__(self): # Representação em string do objeto
        return f"{self.usuario.username} - {self.texto_sentimento[:30]}..."