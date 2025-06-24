import { StoryModel } from "../../models/StoryModel.js";
import { StoryPresenter } from "../../presenters/StoryPresenter.js";
import { createStoryItem } from "../../components/StoryItem.js";
import { createLoadingIndicator } from "../../components/LoadingIndicator.js";
import { createNotificationToggle } from "../../components/NotificationToggle.js";
import { createInstallPWAButton } from "../../components/InstallPWA.js";
import { createOfflineManager } from "../../components/OfflineManager.js";
import { registerServiceWorker } from "../../utils/notification.js";

class Home {
  constructor() {
    this._storyModel = new StoryModel();
    this._storyPresenter = null;
  }

  async render() {
    return `
      <div class="homepage-container">
        <div class="homepage-header">
          <h2 id="latest-stories-heading">Cerita Terbaru</h2>
        </div>
        <div id="loading-container"></div>
        <div id="map-container"></div>
        <div id="story-list-container"></div>
      </div>
    `;
  }

  async afterRender() {
    // Inisialisasi service worker saat halaman dimuat
    registerServiceWorker();
    
    const container = document.querySelector('.homepage-container');
    const headerSection = container.querySelector('.homepage-header');
    const loadingContainer = document.getElementById('loading-container');
    const mapContainer = document.getElementById('map-container');
    const storyListContainer = document.getElementById('story-list-container');

    // Tambahkan toggle notifikasi jika browser mendukung
    if ('Notification' in window && 'serviceWorker' in navigator) {
      createNotificationToggle(headerSection);
    }
    
    // Tambahkan tombol instalasi PWA
    createInstallPWAButton(headerSection);
    
    // Tambahkan pengelola data offline
    createOfflineManager(container);

    const loadingIndicator = createLoadingIndicator();
    loadingContainer.appendChild(loadingIndicator);

    // Create view interface for presenter
    const homeView = {
      displayStories: (stories) => {
        loadingIndicator.remove();
        
        // Only create map if there are stories with location
        const storiesWithLocation = stories.filter(
          (story) => story.lat && story.lon
        );

        if (storiesWithLocation.length > 0) {
          mapContainer.innerHTML = `
            <div class="homepage-map-container">
              <h3>Peta Lokasi Cerita</h3>
              <div id="stories-map" style="height: 400px; border-radius: 8px; z-index: 0;"></div>
            </div>
          `;
          
          // Initialize map
          const map = window.L ? window.L.map('stories-map').setView([-2.548926, 118.0148634], 5) : null;

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
                <a href="#/story/${story.id}">Lihat Detail</a>
              `);
            });
          }
        }

        // Create story list
        storyListContainer.innerHTML = '<div class="story-list"></div>';
        const storyListDiv = storyListContainer.querySelector('.story-list');

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
      },
      showError: (message) => {
        loadingIndicator.remove();
        const errorMessage = document.createElement("p");
        errorMessage.className = "error-message";
        errorMessage.textContent = `Error: ${message}`;
        storyListContainer.appendChild(errorMessage);
      }
    };

    // Create presenter and get stories
    this._storyPresenter = new StoryPresenter(homeView, this._storyModel);
    await this._storyPresenter.getAllStories();
  }

  cleanup() {
    // Cleanup any resources if needed
    if (this._storyPresenter) {
      this._storyPresenter = null;
    }
  }
}

export default Home;
