import api from '../../services/api.js';

// =============================
// MOSTRAR / OCULTAR SENHA
// =============================
function togglePassword(id) {
  const input = document.getElementById(id);
  const toggleIcon = input.closest(".password-wrapper").querySelector(".toggle-password");

  if (input.type === "password") {
    input.type = "text";
    toggleIcon.textContent = "🙈";
  } else {
    input.type = "password";
    toggleIcon.textContent = "👁️";
  }
}

// =============================
// FORÇA DA SENHA
// =============================
function checkPasswordStrength() {
  const password = document.getElementById("password").value;
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");

  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  switch (strength) {
    case 0:
      strengthBar.style.width = "0%";
      strengthText.innerText = "";
      break;
    case 1:
      strengthBar.style.width = "25%";
      strengthBar.style.background = "#ff4d4d";
      strengthText.innerText = "Senha fraca";
      break;
    case 2:
      strengthBar.style.width = "50%";
      strengthBar.style.background = "#ff9800";
      strengthText.innerText = "Senha média";
      break;
    case 3:
      strengthBar.style.width = "75%";
      strengthBar.style.background = "#2196f3";
      strengthText.innerText = "Senha forte";
      break;
    case 4:
      strengthBar.style.width = "100%";
      strengthBar.style.background = "#00c853";
      strengthText.innerText = "Senha muito forte";
      break;
  }
}

// =============================
// CADASTRAR USUÁRIO
// =============================
async function signupUser(event) {
  event.preventDefault();

  const email = document.getElementById("email");
  const nome = document.getElementById("nome");
  const user = document.getElementById("user");
  const nascimento = document.getElementById("nascimento");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  const emailError = document.getElementById("emailError");
  const nameError = document.getElementById("nameError");
  const userError = document.getElementById("userError");
  const birthError = document.getElementById("birthError");

  let valid = true;

  // EMAIL
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email.value)) {
    emailError.style.display = "block";
    valid = false;
  } else {
    emailError.style.display = "none";
  }

  // NOME
  if (nome.value.trim().length < 3) {
    nameError.style.display = "block";
    valid = false;
  } else {
    nameError.style.display = "none";
  }

  // USUÁRIO
  if (user.value.trim().length < 3) {
    userError.style.display = "block";
    valid = false;
  } else {
    userError.style.display = "none";
  }

  // IDADE
  const birthDate = new Date(nascimento.value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age < 13) {
    birthError.style.display = "block";
    valid = false;
  } else {
    birthError.style.display = "none";
  }

  // SENHAS
  if (password.value.length < 8) {
    alert("A senha precisa ter pelo menos 8 caracteres.");
    valid = false;
  }
  if (password.value !== confirmPassword.value) {
    alert("As senhas não coincidem.");
    valid = false;
  }

  if (!valid) return;

  // Dados para API
  const dadosParaCadastro = {
    email: email.value.trim(),
    nome: nome.value.trim(),
    username: user.value.trim(),
    nascimento: nascimento.value.trim(),
    senha: password.value.trim(),
    confirmar_senha: confirmPassword.value.trim()
  };

  try {
    const response = await api.post('api/cadastrar/', dadosParaCadastro);
    if (response.status === 201) {
      alert("✅ Conta criada com sucesso!");
      window.location.href = '../login.html';
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // Erros de validação
      const erros = error.response.data;
      let mensagemErro = "Erro ao cadastrar usuário:\n";
      // Exibe todos os erros retornados pela API
      for (const campo in erros) {
        mensagemErro += `- ${campo}: ${erros[campo]}\n`;
      }
      alert(mensagemErro);
    } else {
      alert("Erro interno no servidor. Tente novamente mais tarde.");
    }
  }
}

// =============================
// EXPOR FUNÇÕES AO ESCOPO GLOBAL
// =============================
window.togglePassword = togglePassword;
window.checkPasswordStrength = checkPasswordStrength;
window.signupUser = signupUser;
