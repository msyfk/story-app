import { setupPWAInstallPrompt, checkPWAInstallation } from '../utils/notification.js';

export const createInstallPWAButton = (parentElement) => {
  // Jika aplikasi sudah diinstal atau tidak mendukung instalasi, jangan tampilkan tombol
  if (checkPWAInstallation() || !('serviceWorker' in navigator)) {
    return null;
  }
  
  const container = document.createElement('div');
  container.className = 'install-pwa-container';
  
  const button = document.createElement('button');
  button.className = 'btn-secondary install-pwa-btn';
  button.setAttribute('aria-label', 'Instal aplikasi');
  button.textContent = 'Instal Aplikasi';
  button.style.display = 'none'; // Sembunyikan tombol secara default
  
  container.appendChild(button);
  parentElement.appendChild(container);
  
  // Setup prompt instalasi dan callback untuk menampilkan/menyembunyikan tombol
  const showInstallPrompt = setupPWAInstallPrompt((promptAvailable) => {
    button.style.display = promptAvailable ? 'block' : 'none';
  });
  
  // Tambahkan event listener untuk tombol
  button.addEventListener('click', async () => {
    button.disabled = true;
    button.textContent = 'Menginstal...';
    
    const installed = await showInstallPrompt();
    
    if (!installed) {
      button.textContent = 'Instal Aplikasi';
      button.disabled = false;
    }
  });
  
  return container;
};