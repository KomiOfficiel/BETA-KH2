window.addEventListener('DOMContentLoaded', () => {
    const loadingCard = document.getElementById('loading-card');
    const followersEl = document.getElementById('followers');
    const followingEl = document.getElementById('following');
    const followersBlock = document.getElementById('followers-block');
    const followingBlock = document.getElementById('following-block');
    const followBtn = document.getElementById('follow-btn');
    const displayName = document.getElementById('display-name');
    const displayTitle = document.getElementById('display-title');
    const displayPseudo = document.getElementById('display-pseudo');
    const descriptionEl = document.getElementById('description');
    const roleTag = document.getElementById('role-tag');
    const tagList = document.getElementById('tag-list');
    const bannerDiv = document.getElementById('banner');
    const avatarImg = document.getElementById('avatar-img');
    const bannerFallback = document.getElementById('banner-fallback');
    const avatarInput = document.getElementById('avatar-input');
    const bannerInput = document.getElementById('banner-input');
    const btnEdit = document.getElementById('btn-edit');
    const editPanel = document.getElementById('edit-panel');
    const inputName = document.getElementById('input-name');
    const inputTitle = document.getElementById('input-title');
    const inputPseudo = document.getElementById('input-pseudo');
    const inputDesc = document.getElementById('input-desc');
    const inputNote = document.getElementById('input-note');
    const noteCountEl = document.getElementById('note-count');
    const editAvatarInput = document.getElementById('edit-avatar-input');
    const editBannerInput = document.getElementById('edit-banner-input');
    const confirmBtn = document.getElementById('confirm-btn');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const panelUsername = document.getElementById('panel-username');
    const followersModal = document.getElementById('followers-modal');
    const followersList = document.getElementById('followers-list');
    const followersTitle = document.getElementById('followers-title');
    const followersClose = document.getElementById('followers-close');
    const followersOverlay = document.querySelector('.followers-overlay');
    const logo = document.getElementById('logo');
    const navWidget = document.getElementById('nav-widget');
    const navItems = document.querySelectorAll('.nav-item');

    const defaultProfile = {
        name: "Nom d'utilisateur",
        description: 'Une courte description du profil. Cliquez sur "Modifier le profil" pour la changer.',
        personalNote: '',
        avatarData: null,
        bannerData: null,
        title: '',
        pseudo: '',
        followersList: [],
        followingList: [],
        isFollowing: false,
        role: '',
        tags: []
    };

    let state = Object.assign({}, defaultProfile);

    function loadState() {
        let raw = null;
        try {
            raw = localStorage.getItem('profile_state');
            if (raw) {
                const stored = JSON.parse(raw);
                state = Object.assign({}, defaultProfile, stored);
                if (Array.isArray(state.followersList)
                    && state.followersList.length === 4
                    && state.followersList.includes('ClaireOfficiel')
                    && state.followersList.includes('AdminKH2')
                    && state.followersList.includes('JeanDupont')
                    && state.followersList.includes('LauraFonctionnaire')) {
                    state.followersList = [];
                }
            }
        } catch (error) {
            console.error('Erreur loadState', error);
        }

        if (!Array.isArray(state.followersList)) {
            state.followersList = [];
        }
        if (!Array.isArray(state.followingList)) {
            state.followingList = [];
        }
        if (!Array.isArray(state.tags)) {
            state.tags = [];
        }
        if (!state.role) {
            state.role = '';
        }
        if (state.pseudo) {
            addPseudoToRegistry(state.pseudo);
            const storedRecord = loadProfileRecord(state.pseudo);
            if (storedRecord && Array.isArray(storedRecord.tags)) {
                state.tags = storedRecord.tags;
            }
        }
        if (!raw) {
            saveState();
        }
    }

    function saveState() {
        try {
            localStorage.setItem('profile_state', JSON.stringify(state));
            saveProfileRecord();
        } catch (error) {
            console.error('Erreur saveState', error);
        }
    }

    function getPseudoRegistry() {
        try {
            return JSON.parse(localStorage.getItem('profile_pseudos') || '[]');
        } catch (error) {
            return [];
        }
    }

    function isPseudoAvailable(pseudo) {
        if (!pseudo) return false;
        const registry = getPseudoRegistry();
        return !registry.includes(pseudo.toLowerCase());
    }

    function addPseudoToRegistry(pseudo) {
        if (!pseudo) return;
        const registry = getPseudoRegistry();
        const normalized = pseudo.toLowerCase();
        if (!registry.includes(normalized)) {
            registry.push(normalized);
            localStorage.setItem('profile_pseudos', JSON.stringify(registry));
        }
    }

    function loadProfilesRegistry() {
        try {
            return JSON.parse(localStorage.getItem('profile_records') || '{}');
        } catch (error) {
            return {};
        }
    }

    function saveProfilesRegistry(registry) {
        try {
            localStorage.setItem('profile_records', JSON.stringify(registry));
        } catch (error) {
            console.error('Erreur saveProfilesRegistry', error);
        }
    }

    function loadProfileRecord(pseudo) {
        if (!pseudo) return null;
        const registry = loadProfilesRegistry();
        return registry[pseudo.toLowerCase()] || null;
    }

    function saveProfileRecord() {
        if (!state.pseudo) return;
        const registry = loadProfilesRegistry();
        registry[state.pseudo.toLowerCase()] = {
            pseudo: state.pseudo,
            name: state.name,
            title: state.title,
            description: state.description,
            personalNote: state.personalNote,
            avatarData: state.avatarData,
            bannerData: state.bannerData,
            followersList: state.followersList,
            followingList: state.followingList,
            isFollowing: state.isFollowing,
            role: state.role,
            tags: Array.isArray(state.tags) ? state.tags : []
        };
        saveProfilesRegistry(registry);
    }

    function getTagClass(tag) {
        if (!tag) return '';
        const normalized = tag.toLowerCase();
        if (normalized.includes('kh2 prenium')) {
            return 'role-chip prenium-chip';
        }
        if (normalized.includes('grand gérant')) {
            return 'role-chip tag-grand-gerant';
        }
        if (normalized.includes('collaboration')) {
            return 'role-chip tag-collaboration';
        }
        if (normalized.includes('influenceur')) {
            return 'role-chip tag-influenceur';
        }
        if (normalized.includes('streamer')) {
            return 'role-chip tag-streamer';
        }
        return 'role-chip';
    }

    function showLoading(duration = 1200) {
        if (!loadingCard) return;
        loadingCard.classList.remove('hidden');
        setTimeout(() => loadingCard.classList.add('hidden'), duration);
    }

    function updateFollowButton() {
        if (!followBtn) return;
        followBtn.classList.remove('following', 'active');
        followBtn.textContent = state.isFollowing ? 'Suivie' : 'Suivre';
        const existingCheck = followBtn.querySelector('.check');
        if (existingCheck) existingCheck.remove();
        if (state.isFollowing) {
            const check = document.createElement('span');
            check.className = 'check';
            check.textContent = '';
            followBtn.appendChild(check);
            followBtn.classList.add('following', 'active');
        }
    }

    function updateUI() {
        if (followersEl) followersEl.textContent = state.followersList.length;
        if (followingEl) followingEl.textContent = state.followingList.length;
        if (displayName) displayName.textContent = state.name;
        if (displayTitle) displayTitle.textContent = state.title || '';
        if (displayTitle) displayTitle.style.display = state.title ? 'block' : 'none';
        if (displayPseudo) {
            displayPseudo.textContent = state.pseudo ? `@${state.pseudo}` : '';
        }
        if (descriptionEl) descriptionEl.textContent = state.description || '';
        if (roleTag) roleTag.style.display = state.role === 'Fondateur' ? 'inline-flex' : 'none';
        if (tagList) {
            const existing = tagList.querySelectorAll('.role-chip');
            existing.forEach((chip) => chip.remove());
            (state.tags || []).forEach((tag) => {
                const chip = document.createElement('span');
                chip.className = getTagClass(tag);
                chip.textContent = tag;
                tagList.appendChild(chip);
            });
        }
        if (inputName) inputName.value = state.name;
        if (inputTitle) inputTitle.value = state.title || '';
        if (inputPseudo) {
            inputPseudo.value = state.pseudo || '';
            inputPseudo.disabled = Boolean(state.pseudo);
        }
        if (inputDesc) inputDesc.value = state.description || '';
        if (inputNote) inputNote.value = state.personalNote || '';
        if (noteCountEl) noteCountEl.textContent = (state.personalNote || '').length;

        if (state.avatarData) {
            avatarImg.src = state.avatarData;
            avatarImg.classList.remove('hidden');
            const defaultAvatar = document.querySelector('.main-avatar-default');
            if (defaultAvatar) defaultAvatar.style.display = 'none';
        } else {
            avatarImg.src = '';
            avatarImg.classList.add('hidden');
            const defaultAvatar = document.querySelector('.main-avatar-default');
            if (defaultAvatar) defaultAvatar.style.display = 'flex';
        }

        if (state.bannerData) {
            bannerDiv.style.backgroundImage = `url('${state.bannerData}')`;
            if (bannerFallback) bannerFallback.style.display = 'none';
        } else {
            bannerDiv.style.backgroundImage = '';
            if (bannerFallback) bannerFallback.style.display = 'flex';
        }

        updateFollowButton();
    }

    function renderModalList(list) {
        if (!followersList) return;
        followersList.innerHTML = '';
        if (!list || !list.length) {
            const empty = document.createElement('p');
            empty.className = 'empty-list';
            empty.textContent = 'Aucun follower pour le moment';
            followersList.appendChild(empty);
            return;
        }
        list.forEach((name) => {
            const item = document.createElement('div');
            item.className = 'follower-item';
            item.textContent = name;
            followersList.appendChild(item);
        });
    }

    function openFollowersModal(list, title) {
        if (!followersModal) return;
        if (followersTitle) followersTitle.textContent = title;
        renderModalList(list);
        followersModal.classList.remove('hidden');
    }

    function closeFollowersModal() {
        if (!followersModal) return;
        followersModal.classList.add('hidden');
    }

    function updateNavigation() {
        if (!logo || !navWidget || !navItems.length) return;
        logo.addEventListener('click', (event) => {
            event.stopPropagation();
            navWidget.classList.toggle('hidden');
        });

        document.addEventListener('click', (event) => {
            if (!navWidget.contains(event.target) && event.target !== logo) {
                navWidget.classList.add('hidden');
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                navWidget.classList.add('hidden');
            }
        });

        navItems.forEach((item) => {
            item.addEventListener('click', () => {
                const page = item.getAttribute('data-page');
                navWidget.classList.add('hidden');
                navItems.forEach((n) => n.classList.remove('active'));
                item.classList.add('active');
                const map = {
                    profile: 'Profile.html',
                    chat: '../Chat/ChatPriv.html',
                    welcome: '../Welcome/Welcome.html',
                    settings: '../Settings/Settings.html',
                    Boutique: '../Boutique/Boutique.html',
                    'Chat-Staff': '../Staff-Only/Staff.html'
                };
                const target = map[page];
                if (target) window.location.href = target;
            });
        });
    }

    function handleFileInput(file, kind) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            if (kind === 'avatar') state.avatarData = reader.result;
            else state.bannerData = reader.result;
            saveState();
            updateUI();
        };
        reader.readAsDataURL(file);
    }

    function openEditPanel(forceOpen = false) {
        if (!editPanel) return;
        if (!forceOpen && editPanel.classList.contains('open')) {
            editPanel.classList.remove('open');
            document.querySelector('.profile-card')?.classList.remove('shift-left');
            return;
        }
        editPanel.classList.add('open');
        document.querySelector('.profile-card')?.classList.add('shift-left');
        setTimeout(() => inputName?.focus(), 250);
    }

    function closeEditPanel() {
        if (!editPanel) return;
        editPanel.classList.remove('open');
        document.querySelector('.profile-card')?.classList.remove('shift-left');
    }

    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 1400);
    }

    loadState();
    showLoading(1600);
    updateUI();
    if (!state.pseudo) {
        openEditPanel(true);
    }
    updateNavigation();

    if (followersBlock) {
        followersBlock.addEventListener('click', () => {
            openFollowersModal(state.followersList, 'Abonnés');
        });
    }

    if (followingBlock) {
        followingBlock.addEventListener('click', () => {
            openFollowersModal(state.followingList, 'Abonnements');
        });
    }

    if (followBtn) {
        followBtn.addEventListener('click', () => {
            state.isFollowing = !state.isFollowing;
            if (state.isFollowing) {
                if (!state.followersList.includes('Vous')) {
                    state.followersList.push('Vous');
                }
                showToast('Abonné ajouté');
            } else {
                state.followersList = state.followersList.filter((name) => name !== 'Vous');
                showToast('Abonnement retiré');
            }
            saveState();
            updateUI();
        });
    }

    if (followersClose) followersClose.addEventListener('click', closeFollowersModal);
    if (followersOverlay) followersOverlay.addEventListener('click', closeFollowersModal);
    if (btnEdit) btnEdit.addEventListener('click', () => openEditPanel());
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditPanel);

    if (inputName) {
        inputName.addEventListener('input', () => {
            if (panelUsername) panelUsername.textContent = inputName.value.trim() || defaultProfile.name;
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (!state.pseudo) {
                const pseudoValue = inputPseudo.value.trim();
                if (!pseudoValue) {
                    showToast('Le pseudo unique est requis.');
                    return;
                }
                if (!isPseudoAvailable(pseudoValue)) {
                    showToast('Ce pseudo est déjà utilisé.');
                    return;
                }
                state.pseudo = pseudoValue;
                addPseudoToRegistry(pseudoValue);
            }
            state.title = inputTitle?.value.trim() || '';
            state.name = inputName.value.trim() || defaultProfile.name;
            state.description = inputDesc.value.trim();
            state.personalNote = inputNote.value;
            saveState();
            updateUI();
            closeEditPanel();
            showToast('Profil mis à jour');
        });
    }

    if (noteCountEl && inputNote) {
        noteCountEl.textContent = inputNote.value.length;
        inputNote.addEventListener('input', () => {
            noteCountEl.textContent = inputNote.value.length;
        });
    }

    if (avatarInput) avatarInput.addEventListener('change', (event) => handleFileInput(event.target.files?.[0], 'avatar'));
    if (bannerInput) bannerInput.addEventListener('change', (event) => handleFileInput(event.target.files?.[0], 'banner'));
    if (editAvatarInput) editAvatarInput.addEventListener('change', (event) => handleFileInput(event.target.files?.[0], 'avatar'));
    if (editBannerInput) editBannerInput.addEventListener('change', (event) => handleFileInput(event.target.files?.[0], 'banner'));
});
