import React from "react";
import { useNavigate } from "react-router-dom";
import useAddStoryPresenter from "../presenters/AddStoryPresenter"; // Import presenter
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LoadingIndicator from "../components/LoadingIndicator";

// Fix marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const AddStoryPage = () => {
  const navigate = useNavigate();
  const defaultMapCenter = [-6.2, 106.8]; // Jakarta

  const {
    description,
    setDescription,
    photo,
    setPhoto,
    lat,
    setLat,
    lon,
    setLon,
    loading,
    error,
    success,
    videoRef,
    canvasRef,
    isCameraActive,
    startCamera,
    takePhoto,
    stopCamera,
    handleFileInputChange,
    handleMapClick,
    handleClearLocation,
    mapMarker,
    handleSubmit,
  } = useAddStoryPresenter(navigate); // Panggil presenter

  return (
    <div className="form-card">
      <h2>Tambah Cerita Baru</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Deskripsi Cerita</label>
          <textarea
            id="description"
            placeholder="Tulis cerita Anda di sini..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="6"
          ></textarea>
        </div>

        <fieldset className="form-group">
          {" "}
          {/* Gunakan fieldset */}
          <legend>Foto Cerita</legend> {/* Gunakan legend */}
          {isCameraActive && (
            <div
              style={{
                marginBottom: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  transform: "scaleX(-1)",
                }}
              ></video>
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={takePhoto}
                  className="btn-secondary"
                >
                  Ambil Foto
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="btn-danger"
                >
                  Stop Kamera
                </button>
              </div>
            </div>
          )}
          {!isCameraActive && !photo && (
            <button
              type="button"
              onClick={startCamera}
              className="btn-secondary"
            >
              Buka Kamera
            </button>
          )}
          {photo && (
            <div style={{ marginTop: "15px", textAlign: "center" }}>
              <p>Pratinjau Gambar:</p>
              <img
                src={
                  photo instanceof File || photo instanceof Blob
                    ? URL.createObjectURL(photo)
                    : photo
                }
                alt="Pratinjau gambar yang akan diunggah"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null);
                  }}
                  className="btn-info"
                >
                  Ganti Gambar
                </button>
              </div>
            </div>
          )}
          <p style={{ textAlign: "center", margin: "15px 0" }}>atau</p>
          <label htmlFor="photo-file-input" style={{ display: "none" }}>
            Unggah Foto dari Perangkat
          </label>{" "}
          {/* Label ini untuk input file di bawah */}
          <input
            id="photo-file-input"
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            required={!photo}
            style={{ display: "block" }}
          />
        </fieldset>

        <fieldset className="form-group">
          {" "}
          {/* Gunakan fieldset */}
          <legend>Pilih Lokasi di Peta (Opsional)</legend>{" "}
          {/* Gunakan legend */}
          <MapContainer
            center={defaultMapCenter}
            zoom={10}
            scrollWheelZoom={true}
            style={{
              height: "350px",
              width: "100%",
              borderRadius: "8px",
              marginBottom: "15px",
            }}
            onClick={handleMapClick}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapMarker && (
              <Marker position={mapMarker}>
                <Popup>
                  Lokasi yang Anda pilih: <br />
                  Lat: {lat} <br />
                  Lon: {lon}
                </Popup>
              </Marker>
            )}
          </MapContainer>
          <div style={{ display: "flex", gap: "10px" }}>
            <label htmlFor="lat" style={{ display: "none" }}>
              Latitude
            </label>{" "}
            {/* Label tersembunyi untuk aksesibilitas */}
            <input
              id="lat"
              type="number"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              step="any"
              aria-label="Latitude"
            />
            <label htmlFor="lon" style={{ display: "none" }}>
              Longitude
            </label>{" "}
            {/* Label tersembunyi untuk aksesibilitas */}
            <input
              id="lon"
              type="number"
              placeholder="Longitude"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              step="any"
              aria-label="Longitude"
            />
          </div>
          <button
            type="button"
            onClick={handleClearLocation}
            className="btn-info"
            style={{ marginTop: "10px" }}
          >
            Hapus Lokasi
          </button>
        </fieldset>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Menambahkan..." : "Tambah Cerita"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {loading && <LoadingIndicator />}
    </div>
  );
};

export default AddStoryPage;
