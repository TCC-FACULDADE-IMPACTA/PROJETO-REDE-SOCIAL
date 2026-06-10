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
10. Como rodar os testes.

---

## 1.🚀 Sobre o Projeto
O **MOOD** foi desenvolvido para resolver a deficiência em compartilhar o sentimento real das pessoas. Diferente de outras redes, o nosso foco é usar algoritmos que criam conexão, ao invés de conteúdos virais e estranhos.

Este projeto é um MVP (Minimum Viable Product) focado em:
* Usuários engajados.
* Segurança de dados.
* Feed em tempo real.

---

## 2.✨ Funcionalidades Principais
* ✅ **Autenticação Segura:** Cadastro, Login (JWT/OAuth).
* ✅ **Perfil de Usuário:** Edição, biografia, foto de perfil.
* ✅ **Feed em Tempo Real:** Postagens de texto e GIFs.
* ✅ **Interações:** Curtidas, comentários e compartilhamentos.
* ✅ **Sistema de Amizade/Seguidores:** Seguir, unfollow, solicitações.
  

---

## 3.🛠️ Tecnologias Utilizadas
A rede social foi construída com o seguinte stack tecnológico:

**Front-end:**
* Html
* Css
* JavaScript (Vanilla)

**Back-end:**
* Python (Django)
* Node.js
* Express.js
  
  

**Banco de Dados:**
* PostgreSQL 
  

**Serviços/DevOps:**
* Git/GitHub
* Axios
* Vite
* DJANGO RESTFRAMEWORK
* JWT
* Pytest
* emoji
* SMTPlib
* deep_translator
  

---

## 4.📋 Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina:
* [Python (3.16+)](https://www.python.org)
* [PostGreSQL (18.3+)](https://www.postgresql.org)
* [Node.js (24.14LTS+)](https://nodejs.org/pt-br)

---

## 5.🖥️ Como Instalar e Rodar

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/TCC-FACULDADE-IMPACTO/PROJETO-REDE-SOCIAL.git](https://github.com/TCC-FACULDADE-IMPACTO/PROJETO-REDE-SOCIAL.git)
    ```

2.  **Entre na pasta do projeto:**
    ```bash
    cd PROJETO-REDE-SOCIAL
    ```

3.  **Configure as variáveis de ambiente (.env):**
    * Crie um arquivo `.env` na raiz do backend baseado no `.env.example`.
    * **IMPORTANTE:** Para a integração de GIFs funcionar, adicione sua chave da API do Giphy no arquivo `.env`:
`GIPHY_API_KEY=sua_chave_aqui`.
Ela pode ser gerada através do:
```bash
 https://developers.giphy.com/dashboard/
```

Coloque o GEMINI_API_KEY no `.env.local` dentro da pasta client, para sua chave Gemini API que poder ser gerada através do:
```bash
https://aistudio.google.com/api-keys
```


4.  **Instale as dependências:**
    ```bash
    # Na raiz do projeto 
    pip install -r requirements.txt
    # Dentro da pasta client
    npm install 
    ```

5.  **Migrar o Banco de Dados:**
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
    **Rodar o front-end:**
    ```bash
    npm run dev
    ```

8.  **Acesse as seguintes Rotas:**

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| **POST** | `/api/cadastrar/` | Cria um novo usuário e sua credencial vinculada |
| **POST** | `/api/login/` | Autentica e retorna um Token JWT. |
| **GET** | `/admin/` | Painel de controle administrativo do Django. |
| **GET** | `/api/perfil/` | Retorna o Perfil do usuario (REQUER TOKEN) |
| **GET** | `/api/buscar_gifs/` | Busca GIFs na API externa (Giphy) |
| **POST** | `/api/criar_post/` | Cria a postagem do usuario |
| **DELETE** | `/api/deletar_postagem/<int:post_id>/` | Deleta a postagem do usuario(Requer ID da postagem) |
| **GET** | `/api/listar_postagem/` | Retona todas as postagem dos usuários no banco |
| **PUT/PATCH** | `/api/atualizar_postagem/<int:post_id>/` | Atualiza as postagem do usuário (Requer ID da postagem) |
| **PATCH** | `/api/atualizar_perfil/<int:user_id>/` | Atualiza o perfil do usuário (Requer Id do usuario) |
| **POST** | `/api/gerenciar_reacao/<int:post_id>/` | Cria e salva reações na postagem do usuario |
| **GET** | `/api/api/listar_postagens_usuario/` | Retorna todas as postagens somente do usuario logado |
| **POST** | `api/solicitar_magic_link/` | Retorna um Magic token de acesso|
| **POST** | `api/verificar_magic_link/` | Verifica/autentica o magic token gerado|

---

## 6.📊 Estrutura do Banco de Dados
O modelo de dados é baseado em um grafo social, focado em interações:

<img width="943" height="1055" alt="DER (2)" src="https://github.com/user-attachments/assets/709de392-4072-4274-8793-4edce05842ca" />


---
## 7.📂 Estrutura de Pastas
``` text
├── PROJETO-REDE-SOCIAL/  # Configurações do Django
├── api_postagem/
│   ├── migrations/       # Histórico do banco de dados
│   ├── models.py         # Definição das tabelas (DER)
│   ├── views.py          # Regras de negócio (Fluxograma)
│   └── urls.py           # Rotas da API
├── api_usuarios/         # App principal (Lógica do sistema)
│   ├── migrations/       # Histórico do banco de dados
│   ├── models.py         # Definição das tabelas (DER)
│   ├── views.py          # Regras de negócio (Fluxograma)
│   └── urls.py           # Rotas da API
├── client/               # FRond-end da aplicação
│   ├── imagens/          # Imagens usadas no frond end(ex: icon)
│   ├── services/         # Organização da regra de negócio
|       └── api.js        # Criador de instacias para o Axios
│   ├── sign-up/          # Funcionalidade de cadastramento
├── manage.py             # CLI do Django
├── tests/                # Testes relacionado a aplicação
|   └── test_settings.py  # Testes de configurações
├── setup                 # configurações da aplicação em Geral
└── requirements.txt      # Bibliotecas necessárias
```
## 8.🤝 Diagramas da rede social
Diagramas que demonstram comportamentos dinâmicos do sistema e os processos de negócios.

Diagrama de caso de uso:

<img width="2047" height="489" alt="caso_De_Uso (1)" src="https://github.com/user-attachments/assets/b3818977-f284-4108-9556-92c30e156f59" />


Diagrama de Entidade Relacionamento:

<img width="943" height="1055" alt="DER drawio" src="https://github.com/user-attachments/assets/bd68406a-4d2d-4752-9366-6af2114ada61" />

Diagrama de Classes:

<img width="664" height="983" alt="diagramaClasse" src="https://github.com/user-attachments/assets/ca512923-6fc4-4243-8c9f-ef2d0eafcee7" />




## 9.📜 Licença
Distribuído sob a licença [MIT/Apache/GPL]. Veja LICENSE para mais informações.

## 10.🧪 Como rodar os testes
Executar todos os testes (como a verificação de comunicação com os servidores do Giphy)
```
# No diretório raiz do projeto
python -m pytest

# Com saída detalhada
python -m pytest -v

# Com cobertura
python -m pytest --cov=src --cov-report=term-missing 
```

Desenvolvido por grupo: MOOD - LucasOliveira1995, GuilhermeTyper, nosferavic, Debora001-jpg, maxalexandre15, BMuramoto, GUILHERME-GTS.
