
document.addEventListener('DOMContentLoaded', () => {
	const logo = document.getElementById('logo');
	const navWidget = document.getElementById('nav-widget');
	const navItems = document.querySelectorAll('.nav-item');
	const goToProfileBtn = document.getElementById('go-to-profile');
	const goToChatBtn = document.getElementById('go-to-chat');
	const toastContainer = document.getElementById('toast-container');
	const loadingCard = document.getElementById('loading-card');

	
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
				'profile': '/Profile/Profile.html',
				'chat': '../System/Index/Chat/Chat.html',
				'welcome': '/System/Index/Welcome/Welcome.html',
				'settings': '/System/Index/Settings/Settings.html',
				'Boutique': '/System/Index/Boutique/Boutique.html'
			};
			
			const targetPage = navigationMap[page];
			if (targetPage) {
				window.location.href = targetPage;
			}
		});
	});

	goToProfileBtn.addEventListener('click', () => {
		showToast('Redirection vers ton profil...', { type: 'success', duration: 1500 });
		setTimeout(() => {
			window.location.href = '/Profile/Profile.html';
		}, 600);
	});

	goToChatBtn.addEventListener('click', () => {
		showToast('Redirection vers le chat...', { type: 'success', duration: 1500 });
		setTimeout(() => {
			window.location.href = '/System/Index/Chat/Chat.html';
		}, 600);
	});
});