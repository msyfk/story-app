import { getStoryDetail } from "../services/storyApi.js"; //
import { createLoadingIndicator } from "../components/LoadingIndicator.js"; //
import { formatDistanceToNow } from "date-fns"; //
import { id } from "date-fns/locale"; //

// Fungsi pembantu untuk format tanggal (dari presenter asli)
const formatDateDistance = (isoString) => {
  if (!isoString) return "";
  return formatDistanceToNow(new Date(isoString), {
    addSuffix: true,
    locale: id,
  });
};

export const renderDetailStoryPage = async (parentElement, storyId) => {
  parentElement.innerHTML = ""; // Hapus konten yang ada

  const loadingIndicator = createLoadingIndicator();
  parentElement.appendChild(loadingIndicator);

  try {
    const story = await getStoryDetail(storyId); //
    loadingIndicator.remove(); // Hapus indikator loading

    if (!story) {
      const infoMessage = document.createElement("p");
      infoMessage.className = "info-message"; //
      infoMessage.textContent = "Cerita tidak ditemukan."; //
      parentElement.appendChild(infoMessage);
      return;
    }

    const article = document.createElement("article");
    article.className = "detail-story-card"; //
    article.setAttribute("aria-labelledby", "story-detail-heading"); //
    parentElement.appendChild(article);

    const heading = document.createElement("h2");
    heading.id = "story-detail-heading"; //
    heading.textContent = story.name; //
    article.appendChild(heading);

    const img = document.createElement("img");
    img.src = story.photoUrl; //
    img.alt = `Foto cerita berjudul ${story.name}`;
    article.appendChild(img);

    const description = document.createElement("p");
    description.textContent = story.description; //
    article.appendChild(description);

    const metaDiv = document.createElement("div");
    metaDiv.className = "story-meta"; //
    article.appendChild(metaDiv);

    const createdAtP = document.createElement("p");
    createdAtP.textContent = `Dibuat: ${formatDateDistance(story.createdAt)}`; //
    metaDiv.appendChild(createdAtP);

    if (story.lat && story.lon) {
      //
      const locationP = document.createElement("p");
      locationP.className = "location"; //
      locationP.textContent = `Lokasi: ${story.lat}, ${story.lon}`; //
      metaDiv.appendChild(locationP);
    }
  } catch (err) {
    loadingIndicator.remove();
    const errorMessage = document.createElement("p");
    errorMessage.className = "error-message"; //
    errorMessage.textContent = `Error: ${err.message}`;
    parentElement.appendChild(errorMessage);
  }
};