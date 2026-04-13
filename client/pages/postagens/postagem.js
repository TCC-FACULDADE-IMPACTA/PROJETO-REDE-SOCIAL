import api from "../../services/api.js";

// --- ESTADO DA APLICAÇÃO ---
let editPostId = null; 
let selectedGifUrl = ""; 

// Captura o ID do usuário (vindo do login atualizado)
const MEU_USUARIO_ID = localStorage.getItem("usuario_id");

// --- ELEMENTOS DO DOM ---
const feedElement = document.getElementById('feed');
const inputElement = document.getElementById('feeling-input');
const sendBtn = document.getElementById('send-btn');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-edit-btn'); // Novo botão

// Preview do GIF
const gifPreviewContainer = document.getElementById('gif-preview-container');
const gifPreviewImg = document.getElementById('gif-preview-img');
const removeGifBtn = document.getElementById('remove-gif-btn');

// Modal de GIFs
const gifModal = document.getElementById('gif-modal');
const gifSearchInput = document.getElementById('gif-search-input');
const gifSearchBtn = document.getElementById('gif-search-btn');
const gifResults = document.getElementById('gif-results');
const closeGifModal = document.getElementById('close-modal');

// --- 1. GESTÃO DE ESTADO DO FORMULÁRIO ---

function limparEstadoForm() {
    editPostId = null;
    selectedGifUrl = "";
    inputElement.value = "";
    gifPreviewContainer.classList.add('hidden');
    formTitle.innerText = "Compartilhe um sentimento";
    sendBtn.innerText = "Enviar";
    sendBtn.className = "signature-gradient text-white px-8 py-2.5 rounded-full font-bold shadow-lg transition-all";
    
    if (cancelBtn) cancelBtn.classList.add('hidden');
}

// Evento do botão cancelar
if (cancelBtn) {
    cancelBtn.onclick = () => {
        if (inputElement.value.trim() === "" || confirm("Descartar alterações?")) {
            limparEstadoForm();
        }
    };
}

// --- 2. BUSCA DE GIFS ---

const toggleModal = () => gifModal.classList.toggle('hidden');

document.querySelectorAll('button').forEach(btn => {
    if (btn.innerText.includes("Adicionar GIF")) btn.onclick = toggleModal;
});

if (closeGifModal) closeGifModal.onclick = toggleModal;

async function buscarGifs() {
    const termo = gifSearchInput.value.trim();
    if (!termo) return;
    gifResults.innerHTML = '<p class="col-span-2 text-center py-10">Buscando...</p>';
    try {
        const response = await api.get(`/api/buscar_gifs/?q=${termo}`);
        const gifs = response.data.resultados;
        gifResults.innerHTML = '';
        gifs.forEach(gif => {
            const img = document.createElement('img');
            img.src = gif.url;
            img.className = "w-full h-32 object-cover rounded-xl cursor-pointer hover:ring-4 hover:ring-violet-500 transition-all";
            img.onclick = () => {
                selectedGifUrl = gif.url;
                gifPreviewImg.src = gif.url;
                gifPreviewContainer.classList.remove('hidden');
                toggleModal();
            };
            gifResults.appendChild(img);
        });
    } catch (error) {
        gifResults.innerHTML = '<p class="col-span-2 text-center text-red-500">Erro ao buscar GIFs.</p>';
    }
}
gifSearchBtn.onclick = buscarGifs;

if (removeGifBtn) {
    removeGifBtn.onclick = () => {
        selectedGifUrl = "";
        gifPreviewContainer.classList.add('hidden');
    };
}

// --- 3. CRUD (EDITAR, DELETAR, SALVAR) ---

window.prepararEdicao = (id, texto, gif) => {
    editPostId = id; 
    inputElement.value = texto; 
    
    if (gif && gif !== 'null' && gif !== '') {
        selectedGifUrl = gif;
        gifPreviewImg.src = gif;
        gifPreviewContainer.classList.remove('hidden');
    } else {
        selectedGifUrl = "";
        gifPreviewContainer.classList.add('hidden');
    }

    formTitle.innerText = "Editando seu sentimento";
    sendBtn.innerText = "Salvar Alterações";
    sendBtn.classList.replace('signature-gradient', 'bg-emerald-500'); 
    if (cancelBtn) cancelBtn.classList.remove('hidden');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    inputElement.focus();
};

window.deletarPost = async (id) => {
    if (!confirm("Apagar este sentimento?")) return;
    try {
        await api.delete(`/api/deletar_postagem/${id}/`);
        carregarFeed();
    } catch (error) {
        alert("Erro ao excluir.");
    }
};

sendBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const texto = inputElement.value.trim();
    if (!texto) return alert("Escreva algo!");

    const payload = { texto_sentimento: texto, gif_url: selectedGifUrl };

    try {
        if (editPostId) {
            await api.patch(`/api/atualizar_postagem/${editPostId}/`, payload);
        } else {
            await api.post('/api/criar_post/', payload);
        }
        limparEstadoForm();
        carregarFeed();
    } catch (error) {
        alert("Erro na operação.");
    }
});

// --- 4. RENDERIZAÇÃO ---

async function carregarFeed() {
    try {
        const response = await api.get('/api/listar_postagens/');
        renderPosts(response.data);
    } catch (error) {
        console.error("Erro ao carregar feed.");
    }
}

function renderPosts(posts) {
    feedElement.innerHTML = '';
    console.log("Seu ID logado:", MEU_USUARIO_ID);

    posts.forEach(post => {
        const ehMeuPost = String(post.usuario) === String(MEU_USUARIO_ID);
        const article = document.createElement('article');
        article.className = 'bg-white rounded-2xl p-6 shadow-md mb-6 border border-slate-50';

        article.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold uppercase">
                        ${post.usuario_nome ? post.usuario_nome.substring(0,2) : "??"}
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-900">${post.usuario_nome}</h3>
                        <p class="text-xs text-slate-400">${new Date(post.data_criacao).toLocaleDateString()}</p>
                    </div>
                </div>

                ${ehMeuPost ? `
                    <div class="flex gap-1">
                        <button onclick="prepararEdicao(${post.id}, '${post.texto_sentimento.replace(/'/g, "\\'")}', '${post.gif_url || ''}')" 
                                class="text-violet-500 hover:bg-violet-50 p-2 rounded-full transition-colors">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button onclick="deletarPost(${post.id})" 
                                class="text-red-400 hover:bg-red-50 p-2 rounded-full transition-colors">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                ` : ''}
            </div>

            <p class="text-slate-800 text-lg mb-4">${post.texto_sentimento}</p>
            ${post.gif_url ? `<img src="${post.gif_url}" class="w-full h-auto rounded-xl">` : ''}
        `;
        feedElement.appendChild(article);
    });
}

carregarFeed();