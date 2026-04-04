from rest_framework import serializers
from .models import PostSentimento

# Serializer para o frontend criar um post com texto e GIF
class CriaPostSentimentoSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.ReadOnlyField(source='usuario.nome', read_only=True)  # Exibe o nome do usuário no frontend
    usuario_username = serializers.ReadOnlyField(source='usuario.username', read_only=True)  # Exibe o username do usuário no frontend
    # usuario_foto = serializers.ImageField(source='usuario.foto', read_only=True)  # Exibe a foto do usuário no frontend AGUARDANDO PERFIL DE USUARIO PARA USO...

    class Meta:
        model = PostSentimento
        fields = [
            'id',
            'usuario_nome',
            'usuario_username',
            'texto_sentimento',
            'gif_url',
            'data_criacao',
        ]  # Campos que serão enviados para o frontend

        extra_kwargs = {
            'texto_sentimento': {'required': True, 'allow_blank': False}, # Campo obrigatório
            'gif_url': {'required': False, 'allow_blank': True}, # Campo opcional
            'usuario': {'required': True}  # Campo obrigatório
        }