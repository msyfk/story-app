// src/components/StoryMap.js
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export const createStoryMap = () => {
  const mapDiv = document.createElement("div");
  mapDiv.style.height = "500px";
  mapDiv.style.width = "100%";
  mapDiv.style.borderRadius = "8px";
  mapDiv.id = "story-map-container"; // Assign an ID for Leaflet to target

  return mapDiv;
};

// Fungsi untuk menginisialisasi/memperbarui peta setelah div ada di DOM
export const initMap = (mapElementId, stories) => {
  const mapElement = document.getElementById(mapElementId);
  if (!mapElement) {
    console.error("Map container element not found:", mapElementId);
    return;
  }

  // *** SOLUSI: Hancurkan peta yang ada jika sudah diinisialisasi ***
  // Periksa apakah elemen sudah memiliki instance peta
  if (mapElement._leaflet_id) {
    const existingMap = L.map(mapElementId); // Dapatkan kembali instance peta yang ada
    existingMap.remove(); // Hapus instance peta
    console.log(`Map on ${mapElementId} removed.`);
  }

  const map = L.map(mapElementId).setView([-6.2, 106.8], 10); // Default Jakarta

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const bounds = new L.LatLngBounds();
  let hasValidMarkers = false;

  stories.forEach((story) => {
    if (story.lat && story.lon) {
      const marker = L.marker([story.lat, story.lon]).addTo(map);
      marker.bindPopup(`
                <div>
                    <h4>${story.name}</h4>
                    <p>${story.description}</p>
                    ${
                      story.photoUrl
                        ? `<img src="${story.photoUrl}" alt="${story.name}" style="max-width: 150px; max-height: 100px; object-fit: cover; margin-top: 10px;">`
                        : ""
                    }
                </div>
            `);
      bounds.extend([story.lat, story.lon]);
      hasValidMarkers = true;
    }
  });

  if (hasValidMarkers && bounds.isValid()) {
    map.fitBounds(bounds, { padding: [50, 50] });
  } else {
    // Tampilan default jika tidak ada marker yang valid
    map.setView([-6.2, 106.8], 10);
  }

  return map; // Kembalikan instance peta jika diperlukan
};
