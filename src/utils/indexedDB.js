const DB_NAME = 'story-app-db';
const DB_VERSION = 1;
const STORIES_STORE = 'stories';

// Inisialisasi database
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => {
      reject('Error opening IndexedDB');
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Buat object store untuk menyimpan cerita
      if (!db.objectStoreNames.contains(STORIES_STORE)) {
        const storyStore = db.createObjectStore(STORIES_STORE, { keyPath: 'id' });
        storyStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
};

// Simpan cerita ke IndexedDB
export const saveStoriesToDB = async (stories) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORIES_STORE, 'readwrite');
    const store = tx.objectStore(STORIES_STORE);
    
    // Hapus semua cerita yang ada sebelum menyimpan yang baru
    await clearStories();
    
    // Simpan setiap cerita
    stories.forEach(story => {
      store.add(story);
    });
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Error saving stories to IndexedDB:', error);
    return false;
  }
};

// Ambil semua cerita dari IndexedDB
export const getStoriesFromDB = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORIES_STORE, 'readonly');
    const store = tx.objectStore(STORIES_STORE);
    const index = store.index('createdAt');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting stories from IndexedDB:', error);
    return [];
  }
};

// Ambil cerita berdasarkan ID
export const getStoryByIdFromDB = async (id) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORIES_STORE, 'readonly');
    const store = tx.objectStore(STORIES_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting story from IndexedDB:', error);
    return null;
  }
};

// Hapus semua cerita dari IndexedDB
export const clearStories = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORIES_STORE, 'readwrite');
    const store = tx.objectStore(STORIES_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error clearing stories from IndexedDB:', error);
    return false;
  }
};