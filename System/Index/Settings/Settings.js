// Settings page logic
document.addEventListener('DOMContentLoaded', () => {
	const logo = document.getElementById('logo');
	const navWidget = document.getElementById('nav-widget');
	const navItems = document.querySelectorAll('.nav-item');
	const backBtn = document.getElementById('back-btn');
	const toastContainer = document.getElementById('toast-container');
	const loadingCard = document.getElementById('loading-card');

	// Load settings from localStorage
	const defaultSettings = {
		darkMode: true,
		animations: true,
		publicProfile: true,
		onlineStatus: true,
		allowDM: true,
		chatNotifications: true,
		followNotifications: true,
		sound: true
	};

	let settings = { ...defaultSettings };

	function loadSettings() {
		try {
			const saved = localStorage.getItem('app_settings');
			if (saved) {
				settings = Object.assign(defaultSettings, JSON.parse(saved));
			}
		} catch (e) {
			console.error('Error loading settings:', e);
		}
	}

	function saveSettings() {
		try {
			localStorage.setItem('app_settings', JSON.stringify(settings));
		} catch (e) {
			console.error('Error saving settings:', e);
		}
	}

	function initializeToggles() {
		document.getElementById('dark-mode-toggle').checked = settings.darkMode;
		document.getElementById('animations-toggle').checked = settings.animations;
		document.getElementById('public-profile-toggle').checked = settings.publicProfile;
		document.getElementById('online-status-toggle').checked = settings.onlineStatus;
		document.getElementById('dm-toggle').checked = settings.allowDM;
		document.getElementById('chat-notifications-toggle').checked = settings.chatNotifications;
		document.getElementById('follow-notifications-toggle').checked = settings.followNotifications;
		document.getElementById('sound-toggle').checked = settings.sound;
	}

	function attachToggleListeners() {
		document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
			settings.darkMode = e.target.checked;
			saveSettings();
			showToast('Paramètre enregistré', { type: 'success' });
		});

		document.getElementById('animations-toggle').addEventListener('change', (e) => {
			settings.animations = e.target.checked;
			saveSettings();
			showToast('Paramètre enregistré', { type: 'success' });
		});

		document.getElementById('public-profile-toggle').addEventListener('change', (e) => {
			settings.publicProfile = e.target.checked;
			saveSettings();
			const message = e.target.checked ? 'Profil rendu public' : 'Profil rendu privé';
			showToast(message, { type: 'success' });
		});

		document.getElementById('online-status-toggle').addEventListener('change', (e) => {
			settings.onlineStatus = e.target.checked;
			saveSettings();
			showToast('Paramètre enregistré', { type: 'success' });
		});

		document.getElementById('dm-toggle').addEventListener('change', (e) => {
			settings.allowDM = e.target.checked;
			saveSettings();
			showToast('Paramètre enregistré', { type: 'success' });
		});

		document.getElementById('chat-notifications-toggle').addEventListener('change', (e) => {
			settings.chatNotifications = e.target.checked;
			saveSettings();
			showToast('Paramètre enregistré', { type: 'success' });
		});

		document.getElementById('follow-notifications-toggle').addEventListener('change', (e) => {
			settings.followNotifications = e.target.checked;
			saveSettings();
			showToast('Paramètre enregistré', { type: 'success' });
		});

		document.getElementById('sound-toggle').addEventListener('change', (e) => {
			settings.sound = e.target.checked;
			saveSettings();
			showToast('Paramètre enregistré', { type: 'success' });
		});
	}

	// Toast notifications
	function showToast(message, options = {}) {
		const { type = 'info', duration = 2000 } = options;
		const toast = document.createElement('div');
		toast.className = `toast ${type}`;
		toast.textContent = message;
		toastContainer.appendChild(toast);
		
		setTimeout(() => toast.classList.add('show'), 10);
		setTimeout(() => {
			toast.classList.remove('show');
			setTimeout(() => toast.remove(), 280);
		}, duration);
	}

	// Navigation widget
	logo.addEventListener('click', (e) => {
		e.stopPropagation();
		navWidget.classList.toggle('hidden');
	});

	document.addEventListener('click', (e) => {
		if (!navWidget.contains(e.target) && e.target !== logo) {
			navWidget.classList.add('hidden');
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			navWidget.classList.add('hidden');
		}
	});

	navItems.forEach(item => {
		item.addEventListener('click', (e) => {
			const page = item.getAttribute('data-page');
			navWidget.classList.add('hidden');
			navItems.forEach(n => n.classList.remove('active'));
			item.classList.add('active');
			
			const navigationMap = {
                'profile': '../Profile/Profile.html',
                'chat': '../Chat/ChatPriv.html',
                'welcome': '../Welcome/Welcome.html',
                'settings': 'Settings.html'
            };

			const targetPage = navigationMap[page];
			if (targetPage) {
				window.location.href = targetPage;
			}
		});
	});

	// Show loading screen
	if (loadingCard) {
		loadingCard.classList.remove('hidden');
		setTimeout(() => loadingCard.classList.add('hidden'), 1800);
	}
});