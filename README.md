# PROJETO-REDE-SOCIAL


# 🌐 MOOD

> A plataforma social focada em compartilhar como você está se sentindo.

---

## 📌 Tabela de Conteúdos
1. Sobre o Projeto.
2. Funcionalidades Principais.
3. Tecnologias Utilizadas.
4. Pré-requisitos.
5. Como Instalar e Rodar.
6. Estrutura do Banco de Dados.
7. Como Contribuir.
8. Licença.

---

## 1.🚀 Sobre o Projeto
O **MOOD** foi desenvolvido para resolver a deficiência em compartilhar o sentimento real da pessoas. Diferente de outras redes, o nosso foco é usar algoritmos que cria conexão, ao invés de conteúdos vírais e estranhos.

Este projeto é um MVP (Minimum Viable Product) focado em:
*   Usuários engajados.
*   Segurança de dados.
*   Feed em tempo real.

---

## 2.✨ Funcionalidades Principais
*   ✅ **Autenticação Segura:** Cadastro, Login (JWT/OAuth).
*   ✅ **Perfil de Usuário:** Edição, biografia, foto de perfil.
*   ✅ **Feed em Tempo Real:** Postagens de texto e imagem.
*   ✅ **Interações:** Curtidas, comentários e compartilhamentos.
*   ✅ **Sistema de Amizade/Seguidores:** Seguir, unfollow, solicitações.
*   ✅ **Notificações:** Alertas em tempo real.

---

## 3.🛠️ Tecnologias Utilizadas
A rede social foi construída com o seguinte stack tecnológico:

**Front-end:**
* A DEFINIR

**Back-end:**
*   Python / Django
*   Socket.io - Funcionalidades em tempo real


**Banco de Dados:**
*   PostgreSQL 
  

**Serviços/DevOps:**
*   Docker
*   Git/GitHub

---

## 4.📋 Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina:
*   [Python (3.16+)](https://www.python.org)
*   [Docker](https://www.docker.com)
*   [PostGreSQL (18.3+)](https://www.postgresql.org)

---

## 5.🖥️ Como Instalar e Rodar

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com
    ```

2.  **Entre na pasta do projeto:**
    ```bash
    cd PROJETO-REDE-SOCIAL

    ```
3.  **Configure as variáveis de ambiente (.env):**
    *   Crie um arquivo `.env` na raiz do backend baseado no `.env.example`.

4.  **Instale as dependências:**
   
    ```bash
    pip install -r requirements.txt 
    ```

5.  **Suba o banco de dados com Docker:**
    ```bash
    docker-compose up -d
    ```
6.  **Migrar o Banco de Dados::**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
7.  **Criar Administrador (Django Admin):**
    ```bash
    python manage.py createsuperuser
    ```

8.  **Rodar o Servidor:**
    ```bash
    python manage.py runserver
    ```

9.  Acesse as seguintes Rotas
    ```
    | Método |     Endpoint      |                    Descrição                   |
    | -------| ----------------- | -----------------------------------------------|
    |  POST  |  /api/cadastrar/  | Cria um novo usuário e sua credencial vinculada|
    |  POST  |   /api/login/     | Autentica e retorna um Token JWT.              |
    |  GET   |   /admin/         | Painel de controle administrativo do Django.   |
    ```
---

## 6.📊 Estrutura do Banco de Dados
O modelo de dados é baseado em um grafo social, focado em interações:

*   **Users:** ID, Nome, Email, Senha, Foto, Bio.
*   **Posts:** ID, UserID, Conteúdo, FotoURL, Timestamp.
*   **Follows/Friends:** FollowerID, FollowingID, Data.
*   **Likes/Comments:** ID, PostID, UserID, Conteúdo.

---
## 7.📂 Estrutura de Pastas
```
├── PROGETO-REDE-SOCIAL/  # Configurações do Django
├── api_usuarios/         # App principal (Lógica do sistema)
│   ├── migrations/       # Histórico do banco de dados
│   ├── models.py         # Definição das tabelas (DER)
│   ├── views.py          # Regras de negócio (Fluxograma)
│   └── urls.py           # Rotas da API
├── manage.py             # CLI do Django
└── requirements.txt      # Bibliotecas necessárias
````
---

## 8.🤝 Como Contribuir
Contribuições são o que tornam a comunidade open-source um lugar incrível!

1.  Faça o Fork do projeto.
2.  Crie uma branch para sua funcionalidade (`git checkout -b feature/NovaFuncionalidade`).
3.  Commit suas mudanças (`git commit -m 'Adiciona NovaFuncionalidade'`).
4.  Push para a branch (`git push origin feature/NovaFuncionalidade`).
5.  Abra um Pull Request.

---

## 9.📜 Licença
Distribuído sob a licença [MIT/Apache/GPL]. Veja `LICENSE` para mais informações.

---
Desenvolvido por grupo:  - 


