import api from "../../services/api.js";

async function processarAutenticacao() {
    // 1. Abre a URL do navegador e extrai os parâmetros (ex: ?token=abc123xyz)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenUuid = urlParams.get('token');

    // Se o usuário entrou na página sem nenhum token na URL
    if (!tokenUuid) {
        alert("Link de acesso inválido ou corrompido.");
        window.location.href = "../../index.html"; // Manda de volta pro login
        return;
    }

    try {
        // 2. Faz a chamada POST enviando o UUID recebido para o Django conferir
        const response = await api.post('api/verificar_magic_link/', { token: tokenUuid });
        
        // 3. O Django validou! Agora guardamos os dados no LocalStorage igualzinho ao login convencional
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("usuario_id", response.data.user_id);
        
        // 4. Redireciona o usuário para a página do Feed (Ajuste o caminho para o seu index se necessário)
        window.location.href = "../postagens/postagem.html"; 

    } catch (error) {
        // Exibe o erro exato retornado pelo Django (ex: "Este link já expirou")
        alert(error.response?.data?.erro || "Não foi possível autenticar através deste link.");
        window.location.href = "../../../login/index.html";
    }
}

// Inicializa a validação assim que o arquivo é interpretado pelo navegador
processarAutenticacao();