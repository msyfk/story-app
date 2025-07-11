import { StoryModel } from "../models/StoryModel.js";
import { StoryPresenter } from "../presenters/StoryPresenter.js";
import { createStoryItem } from "../components/StoryItem.js";
import { createLoadingIndicator } from "../components/LoadingIndicator.js";
import { createNotificationToggle } from "../components/NotificationToggle.js";
import { createInstallPWAButton } from "../components/InstallPWA.js";
import { createOfflineManager } from "../components/OfflineManager.js";
import { registerServiceWorker } from "../utils/notification.js";

export const renderHomePage = async (parentElement) => {
  // Inisialisasi service worker saat halaman dimuat
  registerServiceWorker();
  
  // Pastikan parentElement kosong sebelum menambahkan konten baru
  parentElement.innerHTML = "";
  parentElement.setAttribute("aria-labelledby", "latest-stories-heading");

  // Tambahkan toggle notifikasi di bagian atas halaman
  const headerSection = document.createElement("div");
  headerSection.className = "homepage-header";
  headerSection.innerHTML = `
    <h2 id="latest-stories-heading">Cerita Terbaru</h2>
  `;
  
  // Tambahkan toggle notifikasi jika browser mendukung
  if ('Notification' in window && 'serviceWorker' in navigator) {
    createNotificationToggle(headerSection);
  }
  
  // Tambahkan tombol instalasi PWA
  createInstallPWAButton(headerSection);
  
  parentElement.appendChild(headerSection);

  // Tambahkan pengelola data offline
  createOfflineManager(parentElement);

  const loadingIndicator = createLoadingIndicator();
  parentElement.appendChild(loadingIndicator);

  // Create view interface for presenter
  const homeView = {
    displayStories: (stories) => {
      loadingIndicator.remove();
      
      // Only create map if there are stories with location
      const storiesWithLocation = stories.filter(
        (story) => story.lat && story.lon
      );

      if (storiesWithLocation.length > 0) {
        // Periksa apakah peta sudah ada
        if (!document.querySelector('.homepage-map-container')) {
          const mapContainer = document.createElement("div");
          mapContainer.className = "homepage-map-container";
          mapContainer.innerHTML = `
            <h3>Peta Lokasi Cerita</h3>
            <div id="stories-map" style="height: 400px; border-radius: 8px; z-index: 0;"></div>
          `;
          parentElement.appendChild(mapContainer);

          // Initialize map with a unique ID to avoid conflicts
          const mapId = `stories-map-${Date.now()}`;
          mapContainer.querySelector('#stories-map').id = mapId;
          
          // Initialize map
          const map = window.L ? window.L.map(mapId).setView([-2.548926, 118.0148634], 5) : null;

          if (map) {
            window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            // Add markers for stories with location
            storiesWithLocation.forEach((story) => {
              const marker = window.L.marker([story.lat, story.lon]).addTo(map);
              marker.bindPopup(`
                <b>${story.name}</b><br>
                <p>${story.description.substring(0, 50)}...</p>
                <a href="#/stories/${story.id}">Lihat Detail</a>
              `);
            });
          }
        }
      }

      // Periksa apakah daftar cerita sudah ada
      if (!document.querySelector('.story-list')) {
        // Create story list
        const storyListDiv = document.createElement("div");
        storyListDiv.className = "story-list";
        parentElement.appendChild(storyListDiv);

        if (stories.length > 0) {
          stories.forEach((story) => {
            const storyItem = createStoryItem(
              story,
              (path) => (window.location.hash = path)
            );
            storyListDiv.appendChild(storyItem);
          });
        } else {
          const infoMessage = document.createElement("p");
          infoMessage.className = "info-message";
          infoMessage.textContent = "Belum ada cerita yang tersedia.";
          storyListDiv.appendChild(infoMessage);
        }
      }
    },
    showError: (message) => {
      loadingIndicator.remove();
      const errorMessage = document.createElement("p");
      errorMessage.className = "error-message";
      errorMessage.textContent = `Error: ${message}`;
      parentElement.appendChild(errorMessage);
    }
  };

  // Create model and presenter
  const storyModel = new StoryModel();
  const storyPresenter = new StoryPresenter(homeView, storyModel);
  
  // Get stories
  await storyPresenter.getAllStories();
};
