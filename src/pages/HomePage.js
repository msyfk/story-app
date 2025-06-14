import { createLoadingIndicator } from "../components/LoadingIndicator.js";
import { StoryModel } from "../models/StoryModel.js";
import { StoryPresenter } from "../presenters/StoryPresenter.js";
import { createStoryItem } from "../components/StoryItem.js";

export const renderHomePage = async (parentElement) => {
  parentElement.innerHTML = "";
  parentElement.setAttribute("aria-labelledby", "latest-stories-heading");

  const heading = document.createElement("h2");
  heading.id = "latest-stories-heading";
  heading.textContent = "Cerita Terbaru";
  parentElement.appendChild(heading);

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
