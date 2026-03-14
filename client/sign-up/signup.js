import api from '../services/api.js';

// =============================
// MOSTRAR / OCULTAR SENHA
// =============================
function togglePassword(id){

const input = document.getElementById(id)

if(input.type === "password"){
input.type = "text"
}else{
input.type = "password"
}

}


// =============================
// CADASTRAR USUÁRIO
// =============================
function signupUser(event){

event.preventDefault()

const email = document.getElementById("email")
const name = document.getElementById("name")
const user = document.getElementById("user")
const nascimento = document.getElementById("nascimento")
const password = document.getElementById("password")
const confirmPassword = document.getElementById("confirmPassword")

const emailError = document.getElementById("emailError")
const nameError = document.getElementById("nameError")
const userError = document.getElementById("userError")
const birthError = document.getElementById("birthError")

let valid = true


// =============================
// VALIDAR EMAIL
// =============================

const emailRegex = /\S+@\S+\.\S+/

if(!emailRegex.test(email.value)){

emailError.style.display = "block"
email.classList.add("input-error")

setTimeout(()=>{
email.classList.remove("input-error")
},400)

valid = false

}else{

emailError.style.display = "none"

}


// =============================
// VALIDAR NOME
// =============================

if(name.value.trim().length < 3){

nameError.style.display = "block"
name.classList.add("input-error")

setTimeout(()=>{
name.classList.remove("input-error")
},400)

valid = false

}else{

nameError.style.display = "none"

}


// =============================
// VALIDAR USUÁRIO
// =============================

if(user.value.trim().length < 3){

userError.style.display = "block"
user.classList.add("input-error")

setTimeout(()=>{
user.classList.remove("input-error")
},400)

valid = false

}else{

userError.style.display = "none"

}


// =============================
// VALIDAR IDADE
// =============================

const birthDate = new Date(nascimento.value)
const today = new Date()

let age = today.getFullYear() - birthDate.getFullYear()

const month = today.getMonth() - birthDate.getMonth()

if(month < 0 || (month === 0 && today.getDate() < birthDate.getDate())){
age--
}

if(age < 13){

birthError.style.display = "block"
nascimento.classList.add("input-error")

setTimeout(()=>{
nascimento.classList.remove("input-error")
},400)

valid = false

}else{

birthError.style.display = "none"

}


// =============================
// VALIDAR SENHAS
// =============================

if(password.value.length < 6){
    
    alert("A senha precisa ter pelo menos 6 caracteres.")
    valid = false
    
}

if(password.value !== confirmPassword.value){
    
    alert("As senhas não coincidem.")
    valid = false
    
}

if(!valid) return



}


// =============================
// FORÇA DA SENHA
// =============================
function checkPasswordStrength(){
    
    const password = document.getElementById("password").value
    const strengthBar = document.getElementById("strengthBar")
    const strengthText = document.getElementById("strengthText")
    
    let strength = 0
    
    if(password.length >= 6) strength++
    if(/[A-Z]/.test(password)) strength++
    if(/[0-9]/.test(password)) strength++
    if(/[^A-Za-z0-9]/.test(password)) strength++
    
    switch(strength){
        
        case 0:
            strengthBar.style.width = "0%"
            strengthText.innerText = ""
            break
            
            case 1:
                strengthBar.style.width = "25%"
                strengthBar.style.background = "#ff4d4d"
                strengthText.innerText = "Senha fraca"
                break
                
                case 2:
                    strengthBar.style.width = "50%"
                    strengthBar.style.background = "#ff9800"
                    strengthText.innerText = "Senha média"
                    break
                    
                    case 3:
                        strengthBar.style.width = "75%"
                        strengthBar.style.background = "#2196f3"
                        strengthText.innerText = "Senha forte"
                        break
                        
                        case 4:
                            strengthBar.style.width = "100%"
                            strengthBar.style.background = "#00c853"
                            strengthText.innerText = "Senha muito forte"
                            break
                            
                        }
                        
                    }
                    
// =============================
// CRIAR NOVO USUÁRIO
// =============================
const form = document.querySelector('form');
                    
form.addEventListener('submit', async (e) => {
e.preventDefault();

const dadosParaCadastro = {
email: document.getElementById("email").value.trim(),
nome: document.getElementById("nome").value.trim(),
username: document.getElementById("user").value.trim(),
nascimento: document.getElementById("nascimento").value.trim(),
senha: document.getElementById("password").value.trim()
};
                        
try {
// Envia para a sua view 'cadastrar_usuario'
const response = await api.post('api/cadastrar/', dadosParaCadastro);

if (response.status === 201) {
console.log("Usuário cadastrado com sucesso!");                              
//Redireciona para o login após o sucesso
alert("✅ Conta criada com sucesso!")
window.location.href = '../login.html'; 
}
} catch (error) {
// Tratamento de Erros de Validação (Ex: e-mail já existe)
if (error.response && error.response.status === 400) {
// O Django retorna os erros do serializer aqui
// console.error("Erros de validação:", error.response.data);
alert("Este email já está cadastrado." + JSON.stringify(error.response.data));
} else {
alert("Erro interno no servidor. Tente novamente mais tarde.");
}
}
});
// =============================
// SALVAR USUÁRIO
// =============================

usuarios.push(novoUsuario)
localStorage.setItem("usuarios", JSON.stringify(usuarios))
console.log("Usuário cadastrado:", novoUsuario)


                    
                    
                    
                    
                    
                    
                    
                    
                    
                    