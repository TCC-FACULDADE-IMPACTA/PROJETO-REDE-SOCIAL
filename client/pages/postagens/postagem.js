import api from "../../services/api.js";

// VERIFICAÇÃO DE SEGURANÇA
if (!localStorage.getItem("usuario_id")) {
    window.location.href = "../../index.html";
}

let editPostId = null; 
let selectedGifUrl = ""; 
const BASE_URL = "http://127.0.0.1:8000"; 
const MEU_USUARIO_ID = localStorage.getItem("usuario_id");

const REACOES_MAPA = {
    'curtir': '👍', 'amei': '❤️', 'forca': '💪', 
    'haha': '😆', 'uau': '😮', 'triste': '😢', 'grr': '😠'
};

const feedElement = document.getElementById('feed');
const inputElement = document.getElementById('feeling-input');
const sendBtn = document.getElementById('send-btn');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-edit-btn');

const gifPreviewContainer = document.getElementById('gif-preview-container');
const gifPreviewImg = document.getElementById('gif-preview-img');
const removeGifBtn = document.getElementById('remove-gif-btn');

const gifModal = document.getElementById('gif-modal');
const gifSearchInput = document.getElementById('gif-search-input');
const gifSearchBtn = document.getElementById('gif-search-btn');
const gifResults = document.getElementById('gif-results');
const closeGifModal = document.getElementById('close-modal');
const gifTriggerBtn = document.getElementById('gif-trigger-btn');

function limparEstadoForm() {
    editPostId = null;
    selectedGifUrl = "";
    inputElement.value = "";
    gifPreviewContainer.classList.add('hidden');
    formTitle.innerText = "Compartilhe um sentimento";
    sendBtn.innerText = "Enviar";
    sendBtn.className = "envia text-white px-8 py-2.5 rounded-full font-bold shadow-lg active:scale-95 transition-all text-sm";
    if (cancelBtn) cancelBtn.classList.add('hidden');
}

if (cancelBtn) {
    cancelBtn.onclick = () => {
        if (inputElement.value.trim() === "" || confirm("Descartar alterações?")) {
            limparEstadoForm();
        }
    };
}

const toggleModal = () => gifModal.classList.toggle('hidden');
if (gifTriggerBtn) gifTriggerBtn.onclick = toggleModal;
if (closeGifModal) closeGifModal.onclick = toggleModal;

async function buscarGifs() {
    const termo = gifSearchInput.value.trim();
    if (!termo) return;
    gifResults.innerHTML = '<p class="col-span-2 text-center py-10 text-sm text-slate-400">Buscando...</p>';
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
        gifResults.innerHTML = '<p class="col-span-2 text-center text-red-500 text-sm">Erro ao buscar GIFs.</p>';
    }
}
gifSearchBtn.onclick = buscarGifs;

if (removeGifBtn) {
    removeGifBtn.onclick = () => {
        selectedGifUrl = "";
        gifPreviewContainer.classList.add('hidden');
    };
}

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
    sendBtn.className = "bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 rounded-full font-bold shadow-lg active:scale-95 transition-all text-sm";
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

window.handleReacaoClique = async (postId, tipo) => {
    try {
        const response = await api.post(`/api/gerenciar_reacao/${postId}/`, { reacao_tipo: tipo });
        if (response.status === 200 || response.status === 201) carregarFeed();
    } catch (error) {
        console.error("Erro ao salvar reação:", error.response?.data || error);
    }
};

window.handleLikeSimples = (postId) => window.handleReacaoClique(postId, 'curtir');

async function carregarFeed() {
    try {
        const response = await api.get('/api/listar_postagens/');
        const posts = response.data;
        if (posts.length > 0) {
            const meuPost = posts.find(p => p.usuario == MEU_USUARIO_ID);
            if (meuPost && meuPost.usuario_foto) {
                const imgTopo = document.getElementById('user-photo-header');
                if (imgTopo) imgTopo.src = meuPost.usuario_foto;
            }
        }
        renderPosts(posts);
    } catch (error) {
        console.error("Erro ao carregar feed:", error);
    }
}

function renderPosts(posts) {
    feedElement.innerHTML = '';
    posts.forEach(post => {
        const ehMeuPost = String(post.usuario) === String(MEU_USUARIO_ID);
        const resumo = post.reacoes_resumo || {};
        const reacoesAtivas = Object.keys(resumo).filter(tipo => resumo[tipo] > 0);
        const total = post.total_reacoes || 0;

        const fotoAutor = post.usuario_foto 
            ? (post.usuario_foto.startsWith('http') ? post.usuario_foto : `${BASE_URL}${post.usuario_foto}`)
            : 'https://via.placeholder.com/100';

        const article = document.createElement('article');
        article.className = 'bg-white rounded-2xl p-6 border border-[var(--color-surface-container)] shadow-sm mb-6 post-card';
        article.setAttribute('data-id', post.id);

        article.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <img src="${fotoAutor}" class="w-10 h-10 rounded-full object-cover border border-slate-200">
                    <div>
                        <h3 class="font-bold text-slate-900 text-sm">${post.usuario_nome}</h3>
                        <p class="text-xs text-slate-400 font-medium">${new Date(post.data_criacao).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
                ${ehMeuPost ? `
                    <div class="flex gap-1">
                        <button onclick="prepararEdicao(${post.id}, '${post.texto_sentimento.replace(/'/g, "\\'")}', '${post.gif_url || ''}')" class="text-violet-500 hover:bg-violet-50 p-2 rounded-full transition-colors flex items-center justify-center w-9 h-9">
                            <span class="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button onclick="deletarPost(${post.id})" class="text-red-400 hover:bg-red-50 p-2 rounded-full transition-colors flex items-center justify-center w-9 h-9">
                            <span class="material-symbols-outlined text-xl">delete</span>
                        </button>
                    </div>
                ` : ''}
            </div>
            <p class="text-slate-800 text-base mb-4 font-medium leading-relaxed">${post.texto_sentimento}</p>
            ${post.gif_url ? `<img src="${post.gif_url}" class="w-full h-auto block rounded-xl mb-4 border border-slate-100">` : ''}
            ${total > 0 ? `
                <div class="flex items-center gap-2 mb-3 px-1">
                    <div class="flex -space-x-1.5">
                        ${reacoesAtivas.map((tipo, idx) => `
                            <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white ring-2 ring-white text-xs shadow-sm" style="z-index: ${10 - idx}">
                                ${REACOES_MAPA[tipo] || '👍'}
                            </span>
                        `).join('')}
                    </div>
                    <span class="text-xs text-slate-500 font-bold">${total}</span>
                </div>
            ` : ''}
            <div class="post-actions border-t border-slate-100 pt-2">
                <div class="reaction-container relative inline-flex">
                    <div class="reaction-menu">
                        ${Object.keys(REACOES_MAPA).map(tipo => `
                            <button type="button" class="reaction-btn" onclick="handleReacaoClique(${post.id}, '${tipo}')">
                                ${REACOES_MAPA[tipo]}
                            </button>
                        `).join('')}
                    </div>
                    <button type="button" class="btn-like ${post.minha_reacao ? 'active' : ''} flex items-center gap-2 !py-2 !px-4 rounded-full transition-all" onclick="handleLikeSimples(${post.id})">
                        <div class="like-icon-wrapper flex items-center justify-center">
                            ${post.minha_reacao ? `<span class="text-lg">${post.minha_reacao}</span>` : `<span class="material-symbols-outlined text-xl">favorite</span>`}
                        </div>
                        <span class="text-xs font-bold">${post.minha_reacao ? 'Reagido' : 'Reagir'}</span>
                    </button>
                </div>
            </div>
        `;
        feedElement.appendChild(article);
    });
}

carregarFeed();

// --- SISTEMA DE LOGOUT ---
window.executarLogout = () => {
    if (!confirm("Deseja realmente sair da sua conta?")) return;

    localStorage.removeItem("usuario_id");
    localStorage.removeItem("token");
    localStorage.removeItem("access_token"); // Remova todas as chaves de login
    window.location.href = "../../index.html"; 
};