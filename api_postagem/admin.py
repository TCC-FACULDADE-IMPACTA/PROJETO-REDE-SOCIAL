#DJANGO ADMIN
from django.contrib import admin
from api_postagem.models import PostSentimento

@admin.register(PostSentimento)
class PostSentimentoAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'texto_sentimento', 'data_criacao')
    search_fields = ('usuario__username', 'texto_sentimento')
