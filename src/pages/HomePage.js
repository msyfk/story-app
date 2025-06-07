import { getAllStories } from "../services/storyApi.js";
import { createStoryItem } from "../components/StoryItem.js";
import { createLoadingIndicator } from "../components/LoadingIndicator.js";

export const renderHomePage = async (parentElement) => {
  parentElement.innerHTML = ""; // Hapus konten yang ada
  parentElement.setAttribute("aria-labelledby", "latest-stories-heading");

  const heading = document.createElement("h2");
  heading.id = "latest-stories-heading";
  heading.textContent = "Cerita Terbaru";
  parentElement.appendChild(heading);

  const loadingIndicator = createLoadingIndicator();
  parentElement.appendChild(loadingIndicator);

  try {
    const stories = await getAllStories();
    loadingIndicator.remove(); // Hapus indikator loading

    // === PENAMBAHAN BAGIAN PETA ===
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

      // Inisialisasi peta dan pusatkan di Indonesia
      const map = L.map("stories-map").setView([-2.548926, 118.0148634], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Tambahkan marker untuk setiap cerita yang memiliki lokasi
      storiesWithLocation.forEach((story) => {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`
          <b>${story.name}</b><br>
          <p>${story.description.substring(0, 50)}...</p>
          <a href="#/stories/${story.id}">Lihat Detail</a>
        `);
      });
    }
    // === AKHIR DARI PENAMBAHAN BAGIAN PETA ===

    // Daftar cerita (kode yang sudah ada)
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
  } catch (err) {
    loadingIndicator.remove();
    const errorMessage = document.createElement("p");
    errorMessage.className = "error-message";
    errorMessage.textContent = `Error: ${err.message}`;
    parentElement.appendChild(errorMessage);
  }
};
