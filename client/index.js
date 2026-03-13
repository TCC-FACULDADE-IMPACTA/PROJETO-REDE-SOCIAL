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
  // USUÁRIO SIMULADO
  // =============================
  const usuarioCadastrado = {
    email: "usuario@mood.com",
    senha: "123456"
  };

  if (email !== usuarioCadastrado.email) {
    setError(emailInput);
    return;
  }

  if (password !== usuarioCadastrado.senha) {
    setError(passwordInput);
    return;
  }

  // =============================
  // ESTADO LOADING NO BOTÃO
  // =============================
  loginButton.disabled = true;
  loginButton.textContent = "Entrando...";

  // =============================
  // LOGIN SUCESSO
  // =============================
  setTimeout(() => {
    alert("✅ Login realizado com sucesso!");
    loginButton.disabled = false;
    loginButton.textContent = "Entrar";
    // window.location.href = "home.html";
  }, 800);
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