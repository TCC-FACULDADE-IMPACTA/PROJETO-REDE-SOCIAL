import api from "../../services/api.js";

// --- ESTADO DA APLICAÇÃO ---
let editPostId = null; 
let selectedGifUrl = ""; 
const BASE_URL = "http://127.0.0.1:8000"; // Certifique-se que esta URL está correta
const MEU_USUARIO_ID = localStorage.getItem("usuario_id");

// Mapeamento para as reações
const REACOES_MAPA = {
    'curtir': '👍', 'amei': '❤️', 'forca': '💪', 
    'haha': '😆', 'uau': '😮', 'triste': '😢', 'grr': '😠'
};

// --- ELEMENTOS DO DOM ---
const feedElement = document.getElementById('feed');
const inputElement = document.getElementById('feeling-input');
const sendBtn = document.getElementById('send-btn');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-edit-btn');

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

// --- 3. CRUD ---

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

window.handleReacaoClique = async (postId, tipo) => {
    try {
        const response = await api.post(`/api/gerenciar_reacao/${postId}/`, {
            reacao_tipo: tipo 
        });

        if (response.status === 200 || response.status === 201) {
            carregarFeed(); // Atualiza a tela para mostrar o novo emoji e contagem
        }
    } catch (error) {
        console.error("Erro ao salvar reação:", error.response?.data || error);
    }
};

window.handleLikeSimples = (postId) => window.handleReacaoClique(postId, 'curtir');

// --- 4. RENDERIZAÇÃO ---

async function carregarFeed() {
    try {
        const response = await api.get('/api/listar_postagens/');
        const posts = response.data;

        console.log("Posts carregados:", posts); // Debug: Veja se os posts estão chegando
        console.log("Meu ID no LocalStorage:", MEU_USUARIO_ID); // Debug: Veja o seu ID

        if (posts.length > 0) {

            const meuPost = posts.find(p => p.usuario == MEU_USUARIO_ID);
            
            if (meuPost && meuPost.usuario_foto) {
                const imgTopo = document.getElementById('user-photo-header');
                if (imgTopo) {
                    imgTopo.src = meuPost.usuario_foto;
                    console.log("Foto do topo atualizada para:", meuPost.usuario_foto);
                } else {
                    console.error("Elemento 'user-photo-header' não encontrado no HTML!");
                }
            } else {
                console.warn("Nenhum post seu foi encontrado para extrair a foto.");
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
        
        // 2. Lógica de Reações (Estilo Facebook)
        const resumo = post.reacoes_resumo || {};
        const reacoesAtivas = Object.keys(resumo).filter(tipo => resumo[tipo] > 0);
        const total = post.total_reacoes || 0;

        // 3. Tratamento da Foto
        const fotoAutor = post.usuario_foto 
            ? (post.usuario_foto.startsWith('http') ? post.usuario_foto : `${BASE_URL}${post.usuario_foto}`)
            : 'https://via.placeholder.com/100';

        const article = document.createElement('article');
        article.className = 'bg-white rounded-2xl p-6 shadow-md mb-6 border border-slate-50 post-card';
        article.setAttribute('data-id', post.id);

        article.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <img src="${fotoAutor}" class="w-10 h-10 rounded-full object-cover border border-slate-200">
                    <div>
                        <h3 class="font-bold text-slate-900">${post.usuario_nome}</h3>
                        <p class="text-xs text-slate-400">${new Date(post.data_criacao).toLocaleTimeString()}</p>
                    </div>
                </div>

                <!-- BOTÕES DE EDITAR/DELETAR -->
                ${ehMeuPost ? `
                    <div class="flex gap-1" style="pointer-events: auto;">
                        <button onclick="prepararEdicao(${post.id}, '${post.texto_sentimento.replace(/'/g, "\\'")}', '${post.gif_url || ''}')" 
                                class="text-violet-500 hover:bg-violet-50 p-2 rounded-full transition-colors flex items-center justify-center">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button onclick="deletarPost(${post.id})" 
                                class="text-red-400 hover:bg-red-50 p-2 rounded-full transition-colors flex items-center justify-center">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                ` : ''}
            </div>

            <p class="text-slate-800 text-lg mb-4">${post.texto_sentimento}</p>
            ${post.gif_url ? `<img src="${post.gif_url}" class="w-full h-auto rounded-xl mb-4">` : ''}

            <!-- PILHA DE EMOJIS (FACEBOOK STYLE) -->
            ${total > 0 ? `
                <div class="flex items-center gap-2 mb-3 px-1">
                    <div class="flex -space-x-1.5">
                        ${reacoesAtivas.map((tipo, idx) => `
                            <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white ring-2 ring-white text-sm" 
                                  style="z-index: ${10 - idx}">
                                ${REACOES_MAPA[tipo] || '👍'}
                            </span>
                        `).join('')}
                    </div>
                    <span class="text-sm text-slate-500 font-bold">${total}</span>
                </div>
            ` : ''}

            <!-- AÇÕES DE REAÇÃO -->
            <div class="post-actions border-t border-slate-100 pt-3">
                <div class="reaction-container relative inline-flex">
                    <div class="reaction-menu">
                        ${Object.keys(REACOES_MAPA).map(tipo => `
                            <button type="button" class="reaction-btn" onclick="handleReacaoClique(${post.id}, '${tipo}')">
                                ${REACOES_MAPA[tipo]}
                            </button>
                        `).join('')}
                    </div>
                    <button type="button" class="btn-like ${post.minha_reacao ? 'active' : ''} flex items-center gap-2" onclick="handleLikeSimples(${post.id})">
                        <div class="like-icon-wrapper">
                            ${post.minha_reacao ? `<span class="text-xl">${post.minha_reacao}</span>` : `<span class="material-symbols-outlined">favorite</span>`}
                        </div>
                        <span class="text-sm font-bold">${post.minha_reacao ? 'Reagido' : 'Reagir'}</span>
                    </button>
                </div>
            </div>
        `;
        feedElement.appendChild(article);
    });
}

carregarFeed();