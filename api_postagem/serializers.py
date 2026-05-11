from rest_framework import serializers
from .models import PostSentimento, Reacao
import emoji



REACOES_MAPA = {
    'curtir': emoji.emojize(':thumbs_up:', language='alias'),
    'amei': emoji.emojize(':red_heart:', language='alias'),
    'forca': emoji.emojize(':flexed_biceps:', language='alias'),
    'haha': emoji.emojize(':face_with_tears_of_joy:', language='alias'),
    'uau': emoji.emojize(':astonished_face:', language='alias'),
    'triste': emoji.emojize(':pensive_face:', language='alias'),
    'grr': emoji.emojize(':angry_face:', language='alias'),
}

# Serializer para o frontend listar posts com texto e GIF
class ListarPostSentimentoSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.ReadOnlyField(source='usuario.nome', read_only=True)  # Exibe o nome do usuário no frontend
    usuario_username = serializers.ReadOnlyField(source='usuario.username', read_only=True)  # Exibe o username do usuário no frontend
    usuario_foto = serializers.ImageField(source='usuario.foto', read_only=True)
    total_reacoes = serializers.SerializerMethodField()  # Campo para exibir o total de reações
    reacoes_resumo = serializers.SerializerMethodField()  # Campo para exibir um resumo das reações
    minha_reacao = serializers.SerializerMethodField()  # Campo para exibir a reação do usuário autenticado
    
    class Meta:
        model = PostSentimento
        fields = [
            'id', # ID do post
            'usuario',
            'usuario_nome',
            'usuario_username',
            'texto_sentimento',
            'gif_url',
            'usuario_foto',
            'data_criacao',
            'reacoes_resumo',
            'total_reacoes',
            'minha_reacao'
        ]

    # Resumo das reações
    def get_reacoes_resumo(self, obj):
        return {nome: obj.reacoes.filter(reacao_tipo=emj).count() for nome, emj in REACOES_MAPA.items()}

    # Retorna a reação do usuário autenticado
    def get_minha_reacao(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user_autenticado'):
            usuario_logado = request.user_autenticado
            reacao = obj.reacoes.filter(usuario=usuario_logado).first()
            return reacao.reacao_tipo if reacao else None
        return None


        read_only_fields = ['data_criacao']  # Campos somente leitura (não podem ser editados pelo frontend)

    def get_total_reacoes(self, obj):
        return obj.reacoes.count()


# Serializer para o frontend criar um post com texto e GIF
class CriarPostSentimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostSentimento
        fields = [
            'texto_sentimento',
            'gif_url',
        ]
        
        extra_kwargs = {
            'texto_sentimento': {'required': True, 'allow_blank': False}, # Campo obrigatório
            'gif_url': {'required': False, 'allow_blank': True}, # Campo opcional
        }