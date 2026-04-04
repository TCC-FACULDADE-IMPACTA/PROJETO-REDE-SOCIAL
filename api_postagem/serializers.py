from rest_framework import serializers
from .models import PostSentimento

# Serializer para o frontend criar um post com texto e GIF
class CriaPostSentimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostSentimento
        fields = ['gif_url', 'texto_sentimento']
        extra_kwargs = {
            'texto_sentimento': {'required': True, 'allow_blank': False}, # Campo obrigatório
            'gif_url': {'required': False, 'allow_blank': True} # Campo opcional
        }