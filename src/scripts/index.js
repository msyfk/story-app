import '../styles/styles.css';
import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  // Tangkap elemen yang diperlukan untuk App
  const content = document.querySelector('#main-content');
  const drawerButton = document.querySelector('#drawer-button');
  const navigationDrawer = document.querySelector('#navigation-drawer');
  const toggleNotification = document.querySelector('#toggle-notification');

  if (!content || !drawerButton || !navigationDrawer) {
    console.error('Element untuk App tidak ditemukan. Pastikan #main-content, #drawer-button, dan #navigation-drawer ada di DOM.');
    return;
  }

  // Inisialisasi App dengan elemen drawer dan content
  const app = new App({
    content,
    drawerButton,
    navigationDrawer,
    toggleNotification,
  });

  // Render halaman awal
  await app.renderPage();

  // Setup "Skip to Content" link accessibility
  const skipLink = document.querySelector('.skipToContent');
  if (skipLink) {
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
        window.scrollTo(0, mainContent.offsetTop);
      }
    });
  }

  // Hash change untuk SPA routing
  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  // Register service worker jika tersedia
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
});
