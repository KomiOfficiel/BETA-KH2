// Staff.js

document.addEventListener('DOMContentLoaded', function() {
    const logo = document.getElementById('logo');
    const navWidget = document.getElementById('nav-widget');
    const navItems = document.querySelectorAll('.nav-item');
    const commandWidget = document.getElementById('command-widget');
    const commandPanel = document.getElementById('command-panel');
    const toast = document.getElementById('action-toast');
    const toastMessage = document.getElementById('action-toast-message');
    const loadingCard = document.getElementById('loading-card');
    const roleSelect = document.getElementById('role-select');
    const rolePreview = document.getElementById('role-preview');
    const userWidget = document.getElementById('user-widget');
    const userPanel = document.getElementById('user-panel');
    const closeUserPanelBtn = document.getElementById('close-user-panel');
    const userCount = document.getElementById('user-count');
    const userList = document.getElementById('user-list');
    const profileState = JSON.parse(localStorage.getItem('profile_state') || '{}');
    const profilePseudo = profileState.pseudo ? profileState.pseudo.toLowerCase() : '';
    const hasStaffAccess = profilePseudo === 'komi_Officiel';

    if (!hasStaffAccess) {
        window.location.href = '../Welcome/Welcome.html';
        return;
    }

    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        toast.classList.add('show');
        setTimeout(function() {
            toast.classList.remove('show');
            toast.classList.add('hidden');
        }, 1800);
    }

    function normalizePseudo(value) {
        return value.trim().toLowerCase();
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

    function getTargetProfile(user) {
        const registry = loadProfilesRegistry();
        if (registry[user]) {
            return registry[user];
        }
        if (profileState.pseudo && profileState.pseudo.toLowerCase() === user) {
            return profileState;
        }
        return null;
    }

    function saveTargetProfile(pseudo, profile) {
        const registry = loadProfilesRegistry();
        profile.pseudo = profile.pseudo || pseudo;
        registry[pseudo] = profile;
        saveProfilesRegistry(registry);
        if (profileState.pseudo && profileState.pseudo.toLowerCase() === pseudo) {
            profileState.tags = profile.tags || [];
            localStorage.setItem('profile_state', JSON.stringify(profileState));
        }
    }

    function renderUserPanel() {
        if (!userCount || !userList) return;
        const registry = loadProfilesRegistry();
        const users = Object.values(registry).filter((record) => record && record.pseudo);
        userCount.textContent = `${users.length} utilisateur${users.length === 1 ? '' : 's'}`;
        userList.innerHTML = '';
        if (!users.length) {
            const empty = document.createElement('p');
            empty.className = 'empty-list';
            empty.textContent = 'Aucun utilisateur avec pseudo définitif.';
            userList.appendChild(empty);
            return;
        }
        users.forEach((record) => {
            const card = document.createElement('div');
            card.className = 'user-card';
            const title = document.createElement('span');
            title.textContent = record.pseudo || 'Utilisateur inconnu';
            const subtitle = document.createElement('small');
            subtitle.textContent = record.name || 'Sans nom affiché';
            card.appendChild(title);
            card.appendChild(subtitle);
            userList.appendChild(card);
        });
    }

    function closeUserPanel() {
        if (!userPanel) return;
        userPanel.classList.remove('open');
        if (userWidget) userWidget.classList.remove('active');
    }

    logo.addEventListener('click', function(event) {
        event.stopPropagation();
        navWidget.classList.toggle('hidden');
    });

    document.addEventListener('click', function(event) {
        if (!navWidget.contains(event.target) && event.target !== logo) {
            navWidget.classList.add('hidden');
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            navWidget.classList.add('hidden');
            commandPanel.classList.remove('open');
        }
    });

    navItems.forEach(function(item) {
        item.addEventListener('click', function() {
            navItems.forEach(function(nav) {
                nav.classList.remove('active');
            });
            item.classList.add('active');
            navWidget.classList.add('hidden');

            const navigationMap = {
                'profile': '../../../Profile/Profile.html',
                'chat': '../Chat/Chat.html',
                'welcome': '../Welcome/Welcome.html',
                'settings': '../Settings/Settings.html',
                'Boutique': '../Boutique/Boutique.html',
                'Chat-Staff': '../Chat/Chat.html'
            };

            const targetPage = navigationMap[item.dataset.page];
            if (targetPage) {
                window.location.href = targetPage;
            }
        });
    });

    commandWidget.addEventListener('click', function() {
        const open = commandPanel.classList.toggle('open');
        commandWidget.classList.toggle('active', open);
        if (open) {
            closeUserPanel();
        }
    });

    if (userWidget && userPanel) {
        userWidget.addEventListener('click', function() {
            const open = userPanel.classList.toggle('open');
            userWidget.classList.toggle('active', open);
            if (open) {
                renderUserPanel();
                if (commandPanel) {
                    commandPanel.classList.remove('open');
                    commandWidget.classList.remove('active');
                }
            }
        });
    }

    if (closeUserPanelBtn) {
        closeUserPanelBtn.addEventListener('click', closeUserPanel);
    }

    document.addEventListener('click', function(event) {
        if (!userPanel || !userWidget) return;
        const target = event.target;
        if (userPanel.classList.contains('open') && !userPanel.contains(target) && target !== userWidget && !userWidget.contains(target)) {
            closeUserPanel();
        }
    });

    function updateRolePreview() {
        if (!rolePreview || !roleSelect) return;
        const value = roleSelect.value;
        const mapping = {
            'Grand Gérant': { text: 'Grand Gérant', className: 'tag-grand-gerant' },
            'Collaboration': { text: 'Collaboration ★', className: 'tag-collaboration' },
            'Influenceur': { text: 'Influenceur ▶️', className: 'tag-influenceur' },
            'Streamer': { text: 'Streamer 🟣', className: 'tag-streamer' },
            'KH2 Prenium': { text: 'KH2 Prenium ✨', className: 'tag-kh2-prenium' }
        };
        const data = mapping[value];
        rolePreview.className = 'role-preview';
        if (!data) {
            rolePreview.textContent = 'Sélectionnez un rôle pour voir l’apparence du tag.';
            return;
        }
        rolePreview.textContent = data.text;
        rolePreview.classList.add(data.className);
    }

    if (roleSelect) {
        roleSelect.addEventListener('change', updateRolePreview);
        updateRolePreview();
    }

    document.getElementById('add-role-btn').addEventListener('click', function() {
        const user = normalizePseudo(document.getElementById('role-user').value);
        const role = document.getElementById('role-select').value;
        if (!user || !role) {
            showToast('Merci de renseigner un pseudo définitif et un rôle existant.');
            return;
        }
        const target = getTargetProfile(user);
        if (!target) {
            showToast('Aucun profil trouvé pour ce pseudo définitif.');
            return;
        }
        target.tags = Array.isArray(target.tags) ? target.tags : [];
        if (target.tags.includes(role)) {
            showToast('Ce tag est déjà présent.');
            return;
        }
        target.tags.push(role);
        saveTargetProfile(user, target);
        showToast('Tag ajouté : ' + role);
    });

    document.getElementById('remove-role-btn').addEventListener('click', function() {
        const user = normalizePseudo(document.getElementById('remove-role-user').value);
        const role = document.getElementById('remove-role-select').value;
        if (!user || !role) {
            showToast('Merci de renseigner un pseudo définitif et un rôle existant.');
            return;
        }
        const target = getTargetProfile(user);
        if (!target) {
            showToast('Aucun profil trouvé pour ce pseudo définitif.');
            return;
        }
        target.tags = Array.isArray(target.tags) ? target.tags : [];
        if (!target.tags.includes(role)) {
            showToast('Ce tag n’est pas présent sur ce profil.');
            return;
        }
        target.tags = target.tags.filter((tag) => tag !== role);
        saveTargetProfile(user, target);
        showToast('Tag supprimé : ' + role);
    });

    document.getElementById('ban-btn').addEventListener('click', function() {
        const user = document.getElementById('ban-user').value.trim();
        if (!user) {
            showToast('Merci de renseigner un pseudo ou un ID à bannir.');
            return;
        }
        if (user.toLowerCase() === 'fondateur' || user === 'admin') {
            showToast('Vous ne pouvez pas bannir le fondateur.');
            return;
        }
        showToast('Bannissement effectué');
        // TODO: envoyer la commande de bannissement au backend
    });

    // Loading overlay control
    if (loadingCard) {
        loadingCard.classList.remove('hidden');
        setTimeout(() => loadingCard.classList.add('hidden'), 1800);
    }
});
