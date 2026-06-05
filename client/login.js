import api from '/services/api.js';

// =============================
// MOSTRAR / OCULTAR SENHA
// =============================
function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.querySelector(".toggle-password");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.textContent = "🙈";
  } else {
    passwordInput.type = "password";
    toggleIcon.textContent = "👁️";
  }
}

// =============================
// FUNÇÃO PARA ATIVAR ERRO VISUAL
// =============================
function setError(input) {
  const group = input.closest(".input-group");
  group.classList.add("error");

  setTimeout(() => {
    group.classList.remove("error");
  }, 400);
}

// =============================
// LOGIN + VALIDAÇÃO
// =============================
function LoginUser(event) {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginButton = document.querySelector(".login-btn");
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const validEmail = /\S+@\S+\.\S+/.test(email);

  // =============================
  // VALIDAÇÃO EMAIL
  // =============================
  if (!validEmail) {
    setError(emailInput);
    return;
  }

  // =============================
  // VALIDAÇÃO SENHA VAZIA
  // =============================
  if (password.length < 4) {
    setError(passwordInput);
    return;
  }
  
  

  // =============================
  // ESTADO LOADING NO BOTÃO
  // =============================
  loginButton.disabled = true;
  loginButton.textContent = "Entrando...";


}

// =============================
// ENVIO DO FORMULÁRIO
// =============================
const loginForm = document.querySelector(".login-form");
const loginButton = document.querySelector(".login-btn");


// Evento de envio
// Verificamos se o loginForm existe
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();


    // Estado de Loading
    loginButton.disabled = true;
    loginButton.textContent = "Entrando...";

    // Montagem dos dados
    const dadosParaLogin = {
      login: email,
      senha: password
    };

    try {
      const response = await api.post("api/login/", dadosParaLogin);
      
      // Salva o token JWT retornado pelo Django
      localStorage.setItem('token', response.data.token);

      if (response.data.user_id) {
        localStorage.setItem('usuario_id', response.data.user_id);
      }

      alert("✅ Login realizado com sucesso!");
      window.location.href = "/pages/postagens/postagem.html";

    } catch (error) {
      console.error("Erro detalhado da API:", error.response?.data);
      
      // Se for erro 400, o Django dirá qual campo está errado
      const mensagem = error.response?.data?.erro || "❌ Usuário ou senha incorretos.";
      alert(mensagem);
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "Entrar";
    }
  });
} else {
  console.error("Elemento não encontrado no HTML.");
}

// =============================
// LOGIN SOCIAL (SIMULAÇÃO)
// =============================
function loginGoogle() {
  alert("🔐 Login com Google (simulação)");
}

function loginFacebook() {
  alert("📘 Login com Facebook (simulação)");
}

// =============================
// EXPOR FUNÇÕES AO ESCOPO GLOBAL
// =============================
window.togglePassword = togglePassword;
window.loginGoogle = loginGoogle;
window.loginFacebook = loginFacebook;