import api from "../../services/api.js";

// VERIFICAÇÃO DE SEGURANÇA
if (!localStorage.getItem("usuario_id")) {
    window.location.href = "../../index.html";
}

const REACOES_MAPA = {
    'curtir': '👍', 'amei': '❤️', 'forca': '💪', 
    'haha': '😆', 'uau': '😮', 'triste': '😢', 'grr': '😠'
};


const BASE_URL = "http://127.0.0.1:8000";

const modal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-profile-form');
const feedContainer = document.getElementById('feed');

document.addEventListener('DOMContentLoaded', () => {
    carregarConteudoPagina();
    configurarEventosModal();
});

async function carregarConteudoPagina() {
    try {
        const [resPerfil, resPosts] = await Promise.all([
            api.get("/api/perfil/"),
            api.get("/api/listar_postagens_usuario/") 
        ]);

        renderizarDadosPerfil(resPerfil.data);
        renderizarPosts(resPosts.data);

    } catch (error) {
        console.error("Erro ao carregar conteúdo:", error);
        if (error.response?.status === 401) window.location.href = "login.html";
    }
}

function renderizarDadosPerfil(usuario) {
    if (!usuario) return;

    document.getElementById('profile-display-name').textContent = usuario.nome;
    document.getElementById('profile-handle').textContent = `@${usuario.username}`;
    
    const bioTextElement = document.getElementById('profile-bio-text');
    if (bioTextElement) {
        bioTextElement.textContent = usuario.bio || 'Sem biografia';
    }
    
    if (usuario.foto) {
        const fotoUrl = usuario.foto.startsWith('http') ? usuario.foto : `${BASE_URL}${usuario.foto}`;
        
        const imgElement = document.getElementById('profile-img');
        if (imgElement) imgElement.src = fotoUrl;

        const imgTopoProfile = document.getElementById('user-photo-header-profile');
        if (imgTopoProfile) imgTopoProfile.src = fotoUrl;
    }

    const stats = document.querySelectorAll('.stat-value');
    if (usuario.stats && stats.length >= 2) {
        stats[0].textContent = usuario.stats.seguindo;
        stats[1].textContent = usuario.stats.seguidores;
    }

    const inputBioModal = document.getElementById('edit-bio-text');
    if (inputBioModal) inputBioModal.value = usuario.bio || '';
}

function renderizarPosts(posts) {
    if (!posts || posts.length === 0) {
        feedContainer.innerHTML = '<p class="text-center text-slate-400 py-12 text-sm font-medium">Você ainda não compartilhou sentimentos.</p>';
        return;
    }

    feedContainer.innerHTML = '';

    posts.forEach(post => {
        const resumo = post.reacoes_resumo || {};
        const reacoesAtivas = Object.keys(resumo).filter(tipo => resumo[tipo] > 0);
        const total = post.total_reacoes || 0;
        
        const fotoAutor = post.usuario_foto 
            ? (post.usuario_foto.startsWith('http') ? post.usuario_foto : `${BASE_URL}${post.usuario_foto}`)
            : 'https://via.placeholder.com/100';

        const article = document.createElement('article');
        article.className = 'bg-white rounded-2xl p-6 border border-[var(--color-surface-container)] shadow-sm post-card';
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
        feedContainer.appendChild(article);
    });
}

window.handleReacaoClique = async (postId, tipo) => {
    try {
        await api.post(`/api/gerenciar_reacao/${postId}/`, { reacao_tipo: tipo });
        const res = await api.get("/api/listar_postagens_usuario/");
        renderizarPosts(res.data);
    } catch (error) {
        console.error("Erro ao reagir:", error);
    }
};

window.handleLikeSimples = (postId) => window.handleReacaoClique(postId, 'curtir');

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('bio', document.getElementById('edit-bio-text').value);
    
    const fotoFile = document.getElementById('edit-photo').files[0];
    if (fotoFile) formData.append('foto', fotoFile);

    try {
        const response = await api.patch("/api/atualizar_perfil/", formData);
        if (response.status === 200) {
            alert("Perfil updated com sucesso!");
            const dadosNovos = response.data.dados || response.data;
            renderizarDadosPerfil(dadosNovos);
            toggleModal(false);
        }
    } catch (error) {
        console.error("Erro ao salvar perfil:", error.response?.data || error);
        alert("Erro ao salvar perfil.");
    }
});

function configurarEventosModal() {
    const openBtn = document.getElementById('open-modal');
    if (openBtn) openBtn.onclick = () => toggleModal(true);
    
    document.getElementById('close-modal').onclick = () => toggleModal(false);
    document.getElementById('cancel-edit').onclick = () => toggleModal(false);
    window.onclick = (e) => { if (e.target === modal) toggleModal(false); };
}

function toggleModal(show) {
    if (!modal) return;
    if (show) {
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

// --- SISTEMA DE LOGOUT ---
window.executarLogout = () => {
    if (!confirm("Deseja realmente sair da sua conta?")) return;

    localStorage.removeItem("usuario_id");
    localStorage.removeItem("token");
    localStorage.removeItem("access_token"); // Remova todas as chaves de login
    window.location.href = "../../index.html"; 
};