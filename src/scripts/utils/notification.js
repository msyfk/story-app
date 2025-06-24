// Konstanta untuk VAPID key
const PUBLIC_VAPID_KEY = 'BLBz4TKo89cF-N-gGDqOKqEDjSXWwXF9xJTQEcz62hKWQU7jSrUxZF6Pf_0kJTCGDnLyOOAci-KLvC7Z-MwMYQs';

// Fungsi untuk mengkonversi base64 ke Uint8Array (untuk VAPID key)
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Fungsi untuk mendaftarkan service worker
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

// Fungsi untuk meminta izin notifikasi
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Browser tidak mendukung notifikasi');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Fungsi untuk berlangganan push notification
export const subscribeToPushNotification = async () => {
  try {
    const registration = await registerServiceWorker();
    if (!registration) return null;
    
    const permission = await requestNotificationPermission();
    if (!permission) return null;
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
    });
    
    console.log('Push Notification Subscription:', subscription);
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
};

// Fungsi untuk memeriksa status instalasi PWA
export const checkPWAInstallation = () => {
  // Mendeteksi apakah aplikasi sudah diinstal sebagai PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('Aplikasi dijalankan dalam mode standalone (sudah diinstal)');
    return true;
  }
  return false;
};

// Fungsi untuk menampilkan prompt instalasi PWA
export const setupPWAInstallPrompt = (callback) => {
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Mencegah Chrome menampilkan prompt instalasi otomatis
    e.preventDefault();
    // Simpan event untuk digunakan nanti
    deferredPrompt = e;
    // Beri tahu komponen bahwa prompt instalasi tersedia
    if (callback) callback(true);
  });

  // Fungsi untuk menampilkan prompt instalasi
  const showInstallPrompt = async () => {
    if (!deferredPrompt) {
      console.log('Prompt instalasi tidak tersedia');
      return false;
    }

    // Tampilkan prompt instalasi
    deferredPrompt.prompt();
    // Tunggu pengguna merespons prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Pengguna ${outcome === 'accepted' ? 'menerima' : 'menolak'} instalasi`);
    // Hapus referensi ke prompt karena tidak dapat digunakan lagi
    deferredPrompt = null;
    // Beri tahu komponen bahwa prompt instalasi tidak lagi tersedia
    if (callback) callback(false);
    
    return outcome === 'accepted';
  };

  // Deteksi ketika aplikasi berhasil diinstal
  window.addEventListener('appinstalled', () => {
    console.log('Aplikasi berhasil diinstal');
    deferredPrompt = null;
    if (callback) callback(false);
  });

  return showInstallPrompt;
};
