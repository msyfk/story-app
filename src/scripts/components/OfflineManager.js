import { clearStories } from "../utils/indexedDB.js";

export const createOfflineManager = (parentElement) => {
  const container = document.createElement('div');
  container.className = 'offline-manager';
  
  const heading = document.createElement('h3');
  heading.textContent = 'Pengelolaan Data Offline';
  container.appendChild(heading);
  
  const info = document.createElement('p');
  info.textContent = 'Data cerita disimpan secara lokal untuk akses offline.';
  container.appendChild(info);
  
  const clearButton = document.createElement('button');
  clearButton.className = 'btn-danger';
  clearButton.textContent = 'Hapus Data Lokal';
  clearButton.addEventListener('click', async () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data cerita yang tersimpan secara lokal?')) {
      try {
        await clearStories();
        const successMessage = document.createElement('p');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Data lokal berhasil dihapus!';
        container.appendChild(successMessage);
        
        // Hapus pesan setelah 3 detik
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
      } catch (error) {
        console.error(error);
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Gagal menghapus data lokal.';
        container.appendChild(errorMessage);
        
        // Hapus pesan setelah 3 detik
        setTimeout(() => {
          errorMessage.remove();
        }, 3000);
      }
    }
  });
  container.appendChild(clearButton);
  
  parentElement.appendChild(container);
  
  return container;
};