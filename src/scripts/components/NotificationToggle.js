import { subscribeToPushNotification, requestNotificationPermission } from '../utils/notification.js';

export const createNotificationToggle = (parentElement) => {
  const container = document.createElement('div');
  container.className = 'notification-toggle';
  
  const button = document.createElement('button');
  button.className = 'btn-secondary';
  button.setAttribute('aria-label', 'Aktifkan notifikasi');
  button.textContent = 'Aktifkan Notifikasi';
  
  button.addEventListener('click', async () => {
    button.disabled = true;
    button.textContent = 'Memproses...';
    
    try {
      const permission = await requestNotificationPermission();
      
      if (permission) {
        const subscription = await subscribeToPushNotification();
        
        if (subscription) {
          // Di sini Anda bisa mengirim subscription ke server
          // untuk disimpan dan digunakan nanti
          button.textContent = 'Notifikasi Aktif';
          button.classList.add('active');
          
          // Tampilkan notifikasi sukses
          new Notification('Story App', {
            body: 'Notifikasi berhasil diaktifkan!',
            icon: '/icons/notification-icon.png'
          });
        } else {
          button.textContent = 'Gagal Mengaktifkan';
          setTimeout(() => {
            button.textContent = 'Aktifkan Notifikasi';
            button.disabled = false;
          }, 2000);
        }
      } else {
        button.textContent = 'Izin Ditolak';
        setTimeout(() => {
          button.textContent = 'Aktifkan Notifikasi';
          button.disabled = false;
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      button.textContent = 'Terjadi Kesalahan';
      setTimeout(() => {
        button.textContent = 'Aktifkan Notifikasi';
        button.disabled = false;
      }, 2000);
    }
  });
  
  container.appendChild(button);
  parentElement.appendChild(container);
  
  return container;
};