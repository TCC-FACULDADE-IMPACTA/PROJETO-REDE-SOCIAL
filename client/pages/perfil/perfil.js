import api from "../../services/api.js";

// Mapeamento para exibir os emojis baseados nos nomes que o seu banco/serializer usam
const REACOES_MAPA = {
    'curtir': '👍', 'amei': '❤️', 'forca': '💪', 
    'haha': '😆', 'uau': '😮', 'triste': '😢', 'grr': '😠'
};

// URL Base do Django para completar o caminho das imagens se necessário
const BASE_URL = "http://127.0.0.1:8000";

// --- ELEMENTOS DA UI ---
const modal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-profile-form');
const feedContainer = document.getElementById('feed');

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    carregarConteudoPagina();
    configurarEventosModal();
});

// Busca perfil e posts simultaneamente para ganhar tempo
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

// --- 1. RENDERIZAÇÃO DO CABEÇALHO (GUI) ---
function renderizarDadosPerfil(usuario) {
    if (!usuario) return;

    document.getElementById('profile-display-name').textContent = usuario.nome;
    document.getElementById('profile-handle').textContent = `@${usuario.username}`;
    document.getElementById('profile-bio').innerHTML = `
        ${usuario.bio || 'Sem biografia'} <span class="mood-tag">Modo Euphoric</span>
    `;
    
    // Tratamento da Foto: Se vier a URL do Django, aplica no src
    if (usuario.foto) {
        const imgElement = document.getElementById('profile-img');
        // Se a URL começar com /media, concatenamos com o BASE_URL
        imgElement.src = usuario.foto.startsWith('http') ? usuario.foto : `${BASE_URL}${usuario.foto}`;
    }

    const stats = document.querySelectorAll('.stat-value');
    if (usuario.stats && stats.length >= 2) {
        stats[0].textContent = usuario.stats.seguindo;
        stats[1].textContent = usuario.stats.seguidores;
    }

    // Deixa o campo de texto do modal já preenchido com a bio atual
    document.getElementById('edit-bio-text').value = usuario.bio || '';
}

// --- 2. RENDERIZAÇÃO DO FEED DE POSTS ---
function renderizarPosts(posts) {
    if (!posts || posts.length === 0) {
        feedContainer.innerHTML = '<p class="empty-feed">Você ainda não compartilhou sentimentos.</p>';
        return;
    }

    feedContainer.innerHTML = posts.map(post => {
        const minhaReacao = post.minha_reacao; 
        
        // Garante que a foto do dono do post também carregue via URL
        const fotoAutor = post.usuario_foto 
            ? (post.usuario_foto.startsWith('http') ? post.usuario_foto : `${BASE_URL}${post.usuario_foto}`)
            : 'https://via.placeholder.com/100';

        return `
<article class="post-card mood-glow" data-post-id="${post.id}">
    <div class="post-header-content">
        <div class="flex justify-between items-center w-full" style="display: flex; justify-content: space-between; align-items: center;">
            <div class="flex items-center gap-3" style="display: flex; gap: 12px; align-items: center;">
                <img src="${fotoAutor}" class="post-avatar">
                <div class="post-user-info">
                    <span class="post-username">${post.usuario_nome}</span>
                    <span class="post-time">• Agora</span>
                </div>
            </div>

            <div class="post-actions-menu" style="display: flex; gap: 8px;">
                <button onclick="prepararEdicao(${post.id}, '${post.texto_sentimento.replace(/'/g, "\\'")}', '${post.gif_url || ''}')" 
                        style="background: none; border: none; color: var(--color-primary); cursor: pointer; padding: 4px;">
                    <i data-lucide="edit-3" style="width: 18px; height: 18px;"></i>
                </button>
                <button onclick="deletarPost(${post.id})" 
                        style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px;">
                    <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                </button>
            </div>
        </div>
    </div>

    <div class="post-body-text" style="padding: 0.5rem 1.5rem 1rem;">
        <p class="post-content" style="font-size: 1.25rem; font-weight: 500; line-height: 1.4;">
            ${post.texto_sentimento}
        </p>
    </div>

    ${post.gif_url ? `
        <div class="post-image-container-full">
            <img src="${post.gif_url}" class="post-image-square" loading="lazy">
        </div>
    ` : ''}

    <div class="post-footer-actions" style="padding: 1rem 1.5rem;">
        <div class="reaction-container">
            <div class="reaction-menu">
                ${Object.keys(REACOES_MAPA).map(tipo => `
                    <button class="reaction-btn" onclick="handleReacaoClique(${post.id}, '${tipo}')">
                        ${REACOES_MAPA[tipo]}
                    </button>
                `).join('')}
            </div>

            <button class="btn-like ${post.minha_reacao ? 'active' : ''}" onclick="handleLikeSimples(${post.id})">
                ${post.minha_reacao ? `<span class="text-xl">${post.minha_reacao}</span>` : `<i data-lucide="heart"></i>`}
                <span class="like-count">${post.total_reacoes || 0}</span>
            </button>
        </div>
    </div>
</article>
`;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
}

// --- 3. LÓGICA DE REAÇÕES ---
window.handleReacaoClique = async (postId, tipo) => {
    try {
        await api.post(`/api/gerenciar_reacao/${postId}/`, { reacao_tipo: tipo });
        // Recarrega os posts para atualizar a lista
        const res = await api.get("/api/listar_postagens_usuario/");
        renderizarPosts(res.data);
    } catch (error) {
        console.error("Erro ao reagir:", error);
    }
};

window.handleLikeSimples = (postId) => window.handleReacaoClique(postId, 'curtir');

// --- 4. ATUALIZAR PERFIL (PATCH PARA O DJANGO) ---
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('bio', document.getElementById('edit-bio-text').value);
    
    const fotoFile = document.getElementById('edit-photo').files[0];
    if (fotoFile) {
        formData.append('foto', fotoFile);
    }

    try {
        // O Axios/Api service já lida com o boundary do FormData automaticamente
        const response = await api.patch("/api/atualizar_perfil/", formData);
        
        if (response.status === 200) {
            alert("Perfil atualizado!");
            
            // O Django retorna os dados atualizados. Se houver 'dados' dentro da resposta:
            const dadosNovos = response.data.dados || response.data;
            renderizarDadosPerfil(dadosNovos);
            
            toggleModal(false);
        }
    } catch (error) {
        console.error("Erro ao salvar perfil:", error.response?.data || error);
        alert("Erro ao salvar perfil. Verifique o console.");
    }
});

// --- 5. LÓGICA DO MODAL ---
function configurarEventosModal() {
    const openBtn = document.getElementById('open-modal');
    if (openBtn) openBtn.onclick = () => toggleModal(true);
    
    document.getElementById('close-modal').onclick = () => toggleModal(false);
    document.getElementById('cancel-edit').onclick = () => toggleModal(false);
    
    window.onclick = (e) => { if (e.target === modal) toggleModal(false); };
}

function toggleModal(show) {
    show ? modal.classList.add('active') : modal.classList.remove('active');
}