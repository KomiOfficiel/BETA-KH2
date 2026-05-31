document.addEventListener('DOMContentLoaded', () => {
	const logo = document.getElementById('logo');
	const navWidget = document.getElementById('nav-widget');
	const navItems = document.querySelectorAll('.nav-item');
	const loadingCard = document.getElementById('loading-card');

	// Logo navigation toggle
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

	// Navigation items
	navItems.forEach(item => {
		item.addEventListener('click', (e) => {
			const page = item.getAttribute('data-page');
			navWidget.classList.add('hidden');
			navItems.forEach(n => n.classList.remove('active'));
			item.classList.add('active');
			
			const navigationMap = {
				'profile': '../Profile/Profile.html',
				'chat': '../Chat/Chat.html',
				'welcome': '../Welcome/Welcome.html',
				'settings': '../Settings/Settings.html',
				'boutique': '../Boutique/Boutique.html'
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
		setTimeout(() => {
			loadingCard.classList.add('hidden');
		}, 2000);
	}
});