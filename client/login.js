import api from './services/api.js';

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
const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const dados = {
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim()
  };
  
  try {
    const response = await api.post("api/login/", dados);
    // salvar token no localStorage
    localStorage.setItem('token', response.data.token);

    alert("✅ Login realizado com sucesso!");
    loginButton.disabled = false;
    loginButton.textContent = "Entrar";
    window.location.href = "home.html";
    } catch (error) {
    alert(error.response?.data?.error || "❌ Erro ao realizar login!");
  }
});

// =============================
// LOGIN SOCIAL (SIMULAÇÃO)
// =============================
function loginGoogle() {
  alert("🔐 Login com Google (simulação)");
}

function loginFacebook() {
  alert("📘 Login com Facebook (simulação)");
}