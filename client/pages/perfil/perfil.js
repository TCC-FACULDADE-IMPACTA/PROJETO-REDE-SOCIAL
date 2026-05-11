// Dados simulados
const posts = [
    {
        id: 1,
        user: { name: 'Alex Silva', handle: '@alex_vibe', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
        time: '2h',
        content: 'A vibe de hoje está simplesmente eletrizante! ⚡️ Curtindo as luzes da cidade com esse novo preset.',
        image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=800',
        likes: '1.4k',
        reaction: null
    },
    {
        id: 2,
        user: { name: 'Alex Silva', handle: '@alex_vibe', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
        time: '5h',
        content: 'Mood: Focado no fluxo criativo. 🌊 Experimentando novas texturas fluidas.',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
        likes: '856',
        reaction: null
    }
];

const reactions = ['😂', '👍', '❤', '😱', '😢', '😡', '🙏'];

// Função para inicializar ícones
function initIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Função para renderizar posts
function renderPosts() {
    const feed = document.getElementById('feed');
    if (!feed) return;

    feed.innerHTML = posts.map(post => `
        <article class="post-card mood-glow" data-post-id="${post.id}">
            <div class="post-layout">
                <img src="${post.user.avatar}" class="post-avatar">
                <div class="post-main">
                    <div class="post-header">
                        <div class="post-user-info">
                            <div class="post-user-row">
                                <span class="post-username">${post.user.name}</span>
                                <span class="post-time">• ${post.time}</span>
                            </div>
                            <span class="post-handle">${post.user.handle}</span>
                        </div>
                        <button class="post-more">
                            <i data-lucide="more-horizontal" style="width:1.25rem; height:1.25rem;"></i>
                        </button>
                    </div>
                    <p class="post-content">${post.content}</p>
                    <div class="post-image-container">
                        <img src="${post.image}" class="post-image">
                    </div>
                    <div class="post-actions">
                        <div class="reaction-container">
                            <div class="reaction-menu">
                                ${reactions.map(r => `<button class="reaction-btn" onclick="handleReaction(${post.id}, '${r}')">${r}</button>`).join('')}
                            </div>
                            <button class="btn-like group" onclick="handleLike(${post.id})">
                                ${post.reaction ? `<span class="text-xl">${post.reaction}</span>` : `<i data-lucide="heart" style="width:1.25rem; height:1.25rem;"></i>`}
                                <span class="like-count">${post.likes}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    `).join('');
    
    initIcons();
}

// Logica de Reações e Likes
window.handleReaction = (postId, reaction) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.reaction = reaction;
        renderPosts();
    }
};

window.handleLike = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
        if (post.reaction) {
            post.reaction = null;
        } else {
            post.reaction = '❤';
        }
        renderPosts();
    }
};

// Logica do Modal de Perfil
const modal = document.getElementById('edit-modal');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtns = [document.getElementById('close-modal'), document.getElementById('cancel-edit')];
const editForm = document.getElementById('edit-profile-form');

const profileElements = {
    bio: document.getElementById('profile-bio'),
    img: document.getElementById('profile-img')
};

const inputElements = {
    bio: document.getElementById('edit-bio-text'),
    photo: document.getElementById('edit-photo')
};

function toggleModal(show) {
    if (show) {
        // Preencher inputs com valores atuais
        const bioText = profileElements.bio.childNodes[0].textContent.trim();
        inputElements.bio.value = bioText;
        
        modal.classList.add('active');
    } else {
        modal.classList.remove('active');
        inputElements.photo.value = ''; // Reset file input
    }
}

openModalBtn.addEventListener('click', () => toggleModal(true));
closeModalBtns.forEach(btn => btn.addEventListener('click', () => toggleModal(false)));

modal.addEventListener('click', (e) => {
    if (e.target === modal) toggleModal(false);
});

editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Atualizar bio (preservando a tag de modo)
    const moodTag = profileElements.bio.querySelector('.mood-tag').outerHTML;
    profileElements.bio.innerHTML = inputElements.bio.value + ' ' + moodTag;
    
    // Handle File Upload
    const file = inputElements.photo.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            profileElements.img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    toggleModal(false);
});

// Inicializar aplicativo
document.addEventListener('DOMContentLoaded', () => {
    initIcons();
    renderPosts();
});
