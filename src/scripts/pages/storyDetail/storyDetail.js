import { getStoryDetail } from "../../services/storyApi.js";
import { createLoadingIndicator } from "../../components/LoadingIndicator.js";
import { parseActiveUrlWithoutCombiner } from "../../routes/url-parser.js";

class StoryDetail {
  constructor() {
    this.story = null;
    this.map = null;
  }

  async render() {
    return `
      <div class="story-detail-page">
        <div id="loading-container"></div>
        <div id="story-content"></div>
        <div id="error-container"></div>
      </div>
    `;
  }

  async afterRender() {
    const loadingContainer = document.getElementById('loading-container');
    const storyContent = document.getElementById('story-content');
    const errorContainer = document.getElementById('error-container');

    const loadingIndicator = createLoadingIndicator();
    loadingContainer.appendChild(loadingIndicator);

    try {
      // Get story ID from URL
      const url = parseActiveUrlWithoutCombiner();
      const storyId = url.id;

      if (!storyId) {
        throw new Error('Story ID tidak ditemukan');
      }

      // Fetch story data
      this.story = await getStoryDetail(storyId);
      
      loadingIndicator.remove();
      this.renderStoryContent(storyContent);
    } catch (error) {
      loadingIndicator.remove();
      errorContainer.innerHTML = `
        <div class="error-page">
          <h2>Error</h2>
          <p>${error.message}</p>
          <a href="#/" class="btn-primary">Kembali ke Beranda</a>
        </div>
      `;
    }
  }

  renderStoryContent(container) {
    if (!this.story) return;

    container.innerHTML = `
      <div class="story-detail-card">
        <div class="story-detail-header">
          <button onclick="history.back()" class="btn-secondary back-button">← Kembali</button>
          <h1>${this.story.name}</h1>
          <p class="story-date">Dibuat pada: ${new Date(this.story.createdAt).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
        
        <div class="story-detail-content">
          <div class="story-image-container">
            <img src="${this.story.photoUrl}" alt="Foto cerita ${this.story.name}" class="story-image">
          </div>
          
          <div class="story-description">
            <h3>Cerita</h3>
            <p>${this.story.description}</p>
          </div>
          
          ${this.story.lat && this.story.lon ? `
            <div class="story-location">
              <h3>Lokasi</h3>
              <div id="story-detail-map" style="height: 300px; width: 100%; border-radius: 8px; margin-top: 10px;"></div>
              <p class="coordinates">
                Koordinat: ${this.story.lat}, ${this.story.lon}
              </p>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Initialize map if location is available
    if (this.story.lat && this.story.lon) {
      setTimeout(() => {
        this.initializeMap();
      }, 100);
    }
  }

  initializeMap() {
    if (!this.story.lat || !this.story.lon) return;

    this.map = window.L ? window.L.map('story-detail-map').setView([this.story.lat, this.story.lon], 15) : null;
    
    if (this.map) {
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      // Add marker for the story location
      const marker = window.L.marker([this.story.lat, this.story.lon]).addTo(this.map);
      marker.bindPopup(`
        <b>${this.story.name}</b><br>
        <p>${this.story.description.substring(0, 100)}${this.story.description.length > 100 ? '...' : ''}</p>
      `).openPopup();
    }
  }

  cleanup() {
    if (this.map && this.map.remove) {
      this.map.remove();
      this.map = null;
    }
  }
}

export default StoryDetail;
