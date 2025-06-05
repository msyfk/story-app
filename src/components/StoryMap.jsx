// src/components/StoryMap.jsx
import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import CSS Leaflet
import L from "leaflet"; // Import Leaflet library itself

// Fix marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const StoryMap = ({ stories }) => {
  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current && stories.length > 0) {
      // Hitung batas geografis dari semua marker
      const bounds = new L.LatLngBounds();
      stories.forEach((story) => {
        if (story.lat && story.lon) {
          bounds.extend([story.lat, story.lon]);
        }
      });

      if (bounds.isValid()) {
        // Sesuaikan tampilan peta agar mencakup semua marker
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      } else {
        // Default view jika tidak ada marker valid
        mapRef.current.setView([-6.2, 106.8], 10); // Jakarta sebagai default
      }
    }
  }, [stories]);

  return (
    <MapContainer
      center={[-6.2, 106.8]} // Default center (Jakarta) jika belum ada data
      zoom={10} // Default zoom
      scrollWheelZoom={true}
      style={{ height: "500px", width: "100%", borderRadius: "8px" }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }} // Simpan instance peta
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stories.map((story) =>
        story.lat && story.lon ? ( // Pastikan ada data lat dan lon
          <Marker key={story.id} position={[story.lat, story.lon]}>
            <Popup>
              <div>
                <h4>{story.name}</h4>
                <p>{story.description}</p>
                {story.photoUrl && (
                  <img
                    src={story.photoUrl}
                    alt={story.name}
                    style={{
                      maxWidth: "150px",
                      maxHeight: "100px",
                      objectFit: "cover",
                      marginTop: "10px",
                    }}
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default StoryMap;
