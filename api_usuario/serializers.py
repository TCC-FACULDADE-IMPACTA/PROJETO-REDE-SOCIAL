from rest_framework import serializers
from .models import Usuario, Credencial
from datetime import date


# SERIALIZERS PARA O CADASTRO DE USUÁRIOS COM VALIDAÇÕES
class CadastroSerializer(serializers.Serializer):
    nome = serializers.CharField()
    username = serializers.CharField(min_length=4, max_length=30)
    nascimento = serializers.DateField()
    email = serializers.EmailField()
    senha = serializers.CharField(write_only=True, min_length=8)
    confirmar_senha = serializers.CharField(write_only=True)

    # VALIDAÇÃO DE SENHA E CONFIRMAR SENHA
    def validate(self, data):
        if data.get('senha') != data.get('confirmar_senha'):
            raise serializers.ValidationError({"confirmar_senha": "As senhas não coincidem."})
        return data

    # SISTEMA VERIFICA E-MAIL/USERNAME NO BANCO
    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nome de usuário já está em uso.")
        return value
    
    # VALIDAÇÃO DE IDADE (Mínimo 18 anos)
    def validate_nascimento(self, value):
        today = date.today()
        # Cálculo preciso de idade
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        
        if age < 18:
            raise serializers.ValidationError("Você precisa ter pelo menos 18 anos.")
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
        fields = ['id', 'nome', 'username', 'nascimento', 'foto']

class FotoPerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['foto']