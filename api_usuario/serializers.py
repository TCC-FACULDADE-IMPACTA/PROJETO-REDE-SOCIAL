from rest_framework import serializers
from .models import Usuario, Credencial


# SERIALIZERS PARA O CADASTRO DE USUÁRIOS COM VALIDAÇÕES
class CadastroSerializer(serializers.Serializer):
    nome = serializers.CharField()
    username = serializers.CharField()
    aniversario = serializers.DateField()
    email = serializers.EmailField()
    senha = serializers.CharField(write_only=True)

    # SISTEMA VERIFICA E-MAIL/USERNAME NO BANCO
    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nome de usuário já está em uso.")
        return value
    
    def validate_email(self, value):
        if Credencial.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este e-mail já está cadastrado.")
        return value


# SERIALIZERS PARA O LOGIN
class LoginSerializer(serializers.Serializer):
    # ACEITA E-MAIL OU USERNAME COMO 'LOGIN'
    login = serializers.CharField(required=True)
    senha = serializers.CharField(required=True, write_only=True)

# SERIALIZER PARA EXIBIR O PERFIL DO USUÁRIO (SEM DADOS SENSÍVEIS)
class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'username', 'aniversario', 'foto']