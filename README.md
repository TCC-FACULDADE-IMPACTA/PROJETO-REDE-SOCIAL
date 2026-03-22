# PROJETO-REDE-SOCIAL


# 🌐 MOOD

<img width="800" height="264" alt="MOOD-LGO" src="https://github.com/user-attachments/assets/4ac2dad0-f6af-4b92-a92c-5765ec52e920" />

---
> A plataforma social focada em compartilhar como você está se sentindo.

---

## 📌 Tabela de Conteúdos
1. Sobre o Projeto.
2. Funcionalidades Principais.
3. Tecnologias Utilizadas.
4. Pré-requisitos.
5. Como Instalar e Rodar.
6. Estrutura do Banco de Dados.
7. Estrutura de Pastas
8. Diagramas de atividades.
9. Licença.

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
*   ✅ **Feed em Tempo Real:** Postagens de texto e Gift.
*   ✅ **Interações:** Curtidas, comentários e compartilhamentos.
*   ✅ **Sistema de Amizade/Seguidores:** Seguir, unfollow, solicitações.
  

---

## 3.🛠️ Tecnologias Utilizadas
A rede social foi construída com o seguinte stack tecnológico:

**Front-end:**
* A DEFINIR

**Back-end:**
*   Python / Django
*   Node.js
*   Express.js
  
  


**Banco de Dados:**
*   PostgreSQL 
  

**Serviços/DevOps:**
*   Git/GitHub
*   Axios
*   Vite
*   DJANGO RESTFRAMEWORK

---

## 4.📋 Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina:
*   [Python (3.16+)](https://www.python.org)
*   [PostGreSQL (18.3+)](https://www.postgresql.org)
*   [Node.js (24.14LTS+)](https://nodejs.org/pt-br)

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
    npm install 
    ```

5.  **Migrar o Banco de Dados::**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
6.  **Criar Administrador (Django Admin):**
    ```bash
    python manage.py createsuperuser
    ```

7.  **Rodar o Servidor:**
    ```bash
    python manage.py runserver
    ```
    **Rodar o frond-end:**
    ```bash
    npm run dev
    ```

8.  Acesse as seguintes Rotas
    ```
    | Método |     Endpoint      |                    Descrição                   |
    | -------| ----------------- | -----------------------------------------------|
    |  POST  |  /api/cadastrar/  | Cria um novo usuário e sua credencial vinculada|
    |  POST  |   /api/login/     | Autentica e retorna um Token JWT.              |
    |  GET   |   /admin/         | Painel de controle administrativo do Django.   |
    |  GET   |  /api/perfil      | Retorna o Perfil do usuario (REQUER TOKEN)     |
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

## 8.🤝 Diagramas de atividades e banco
Diagramas que demostra comportamentos dinâmicos do sistemas e o processos de negócios.

1.  Funcionalidade Cadastro/Login:
<img width="1508" height="654" alt="CADASTRO_DO_SISTEMA drawio" src="https://github.com/user-attachments/assets/cbde008c-2b72-484d-969d-28955521b9ee" />
2. Banco <img width="1408" height="768" alt="Gemini_Generated_Image_3tn08n3tn08n3tn0" src="https://github.com/user-attachments/assets/24df5289-e56f-49d6-a380-de9e43e7b990" />


## 9.📜 Licença
Distribuído sob a licença [MIT/Apache/GPL]. Veja `LICENSE` para mais informações.

---
Desenvolvido por grupo: MOOD - LucasOliveira1995, GuilhermeTyper, nosferavic, Debora001-jpg, maxalexandre15, BMuramoto, GUILHERME-GTS.  





