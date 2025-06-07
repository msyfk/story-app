import { getAllStories } from "../services/storyApi.js"; //
import { createStoryItem } from "../components/StoryItem.js"; //
import { createLoadingIndicator } from "../components/LoadingIndicator.js";

export const renderHomePage = async (parentElement) => {
  parentElement.innerHTML = ""; // Hapus konten yang ada
  parentElement.setAttribute("aria-labelledby", "latest-stories-heading"); //

  const heading = document.createElement("h2");
  heading.id = "latest-stories-heading"; //
  heading.textContent = "Cerita Terbaru"; //
  parentElement.appendChild(heading);

  const loadingIndicator = createLoadingIndicator();
  parentElement.appendChild(loadingIndicator);

  try {
    const stories = await getAllStories(); //
    loadingIndicator.remove(); // Hapus indikator loading

    // Wadah peta
    const mapContainerDiv = document.createElement("div");
    mapContainerDiv.className = "homepage-map-container"; //
    parentElement.appendChild(mapContainerDiv);

    const mapHeading = document.createElement("h3");
    mapHeading.textContent = "Lokasi Cerita"; //
    mapContainerDiv.appendChild(mapHeading);

    if (stories.length > 0) {
      // Inisialisasi peta Leaflet setelah div peta ada di DOM
      // Gunakan timeout untuk memastikan DOM benar-benar siap, meskipun tidak terlalu diperlukan dengan penambahan langsung
      
    } else {
      const infoMessage = document.createElement("p");
      infoMessage.className = "info-message"; //
      infoMessage.textContent =
        "Tidak ada lokasi cerita untuk ditampilkan di peta."; //
      mapContainerDiv.appendChild(infoMessage);
    }

    // Daftar cerita
    const storyListDiv = document.createElement("div");
    storyListDiv.className = "story-list"; //
    parentElement.appendChild(storyListDiv);

    if (stories.length > 0) {
      stories.forEach((story) => {
        const storyItem = createStoryItem(
          story,
          (path) => (window.location.hash = path)
        ); // Lewatkan navigasi hash langsung
        storyListDiv.appendChild(storyItem);
      });
    } else {
      const infoMessage = document.createElement("p");
      infoMessage.className = "info-message"; //
      infoMessage.textContent = "Belum ada cerita yang tersedia."; //
      storyListDiv.appendChild(infoMessage);
    }
  } catch (err) {
    loadingIndicator.remove();
    const errorMessage = document.createElement("p");
    errorMessage.className = "error-message"; //
    errorMessage.textContent = `Error: ${err.message}`;
    parentElement.appendChild(errorMessage);
  }
};
