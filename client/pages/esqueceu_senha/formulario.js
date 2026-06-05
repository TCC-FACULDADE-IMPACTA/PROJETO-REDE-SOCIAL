import api from "../../services/api.js";

// Supondo que você tenha um botão com id="magic-link-btn" e um input id="email-input"
const magicLinkBtn = document.getElementById('magic-link-btn');
const emailInput = document.getElementById('email-input');

if (magicLinkBtn) {
    magicLinkBtn.onclick = async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!email) {
            alert("Por favor, insira o seu e-mail primeiro!");
            return;
        }

        try {
            magicLinkBtn.innerText = "Enviando...";
            magicLinkBtn.disabled = true;

            const response = await api.post('api/solicitar_magic_link/', { email: email });
            alert(response.data.mensagem);
            
        } catch (error) {
            alert(error.response?.data?.erro || "Erro ao solicitar link.");
        } finally {
            magicLinkBtn.innerText = "Entrar com Link Mágico";
            magicLinkBtn.disabled = false;
        }
    };
}