import React, { useState, useRef, useEffect, useCallback } from "react"; // Import useCallback
import { useNavigate } from "react-router-dom";
import { addStory } from "../services/storyApi";
import { getToken } from "../utils/auth";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issue for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const AddStoryPage = () => {
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const token = getToken();

  // Untuk kamera
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false); // State untuk mengontrol status UI kamera

  // Untuk peta
  const mapRef = useRef(null);
  const [mapMarker, setMapMarker] = useState(null);
  const defaultMapCenter = [-6.2, 106.8]; // Jakarta

  // Gunakan useCallback untuk stopCamera agar tidak dibuat ulang setiap render
  const stopCamera = useCallback(() => {
    console.log("stopCamera called.");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    // Hanya atur srcObject ke null jika videoRef.current ada dan bukan null
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false); // Pastikan state kamera non-aktif
  }, []);

  // Fungsi untuk memulai kamera
  const startCamera = () => {
    setPhoto(null); // Bersihkan pratinjau foto jika ada
    setIsCameraActive(true); // Ini akan memicu `useEffect` untuk memulai stream
    setError(null);
  };

  // useEffect untuk mengelola stream kamera saat isCameraActive berubah
  useEffect(() => {
    console.log(
      "useEffect triggered. isCameraActive:",
      isCameraActive,
      "videoRef.current:",
      videoRef.current
    );

    const initializeCamera = async () => {
      // Pastikan videoRef.current ada sebelum mencoba mengaksesnya
      if (!videoRef.current) {
        console.warn("videoRef.current is null, cannot initialize camera.");
        return;
      }

      // Pastikan belum ada stream aktif untuk mencegah duplikasi
      if (streamRef.current) {
        console.warn("Stream already active.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        console.log("Camera stream attached successfully.");
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
        setIsCameraActive(false); // Nonaktifkan kamera jika terjadi error
      }
    };

    if (isCameraActive) {
      initializeCamera();
    }
    // else if (!isCameraActive && streamRef.current) {
    //   // Ini adalah kondisi yang menyebabkan masalah, stopCamera dipanggil
    //   // saat isCameraActive menjadi false, bahkan jika itu karena unmount.
    //   // Biarkan cleanup function di bawah yang menangani.
    //   stopCamera();
    // }

    // Cleanup function: memastikan stream berhenti saat komponen unmount
    // atau isCameraActive berubah menjadi false (misal, karena user klik stop)
    return () => {
      // Pastikan kita hanya menghentikan stream yang memang aktif dari useEffect ini
      if (streamRef.current) {
        stopCamera();
      }
    };
  }, [isCameraActive, stopCamera]); // Tambahkan stopCamera ke dependency array karena dia useCallback

  // Fungsi untuk mengambil gambar dari kamera
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        setPhoto(blob);
        stopCamera(); // Hentikan kamera setelah mengambil gambar
      }, "image/jpeg");
    } else {
      setError("Video stream tidak tersedia untuk mengambil foto.");
      console.error("VideoRef or CanvasRef is null when trying to take photo.");
    }
  };

  // Handle perubahan file input
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      stopCamera(); // Hentikan kamera jika memilih file
    }
  };

  // Fungsi untuk menangani klik pada peta
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setLat(lat.toFixed(6));
    setLon(lng.toFixed(6));
    setMapMarker([lat, lng]);
  };

  // Reset marker peta jika lat/lon direset secara manual
  useEffect(() => {
    if (!lat && !lon) {
      setMapMarker(null);
    }
  }, [lat, lon]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Anda harus login untuk menambah cerita.");
      setLoading(false);
      return;
    }
    if (!photo) {
      setError("Foto wajib diunggah.");
      setLoading(false);
      return;
    }

    try {
      const parsedLat = lat ? parseFloat(lat) : undefined;
      const parsedLon = lon ? parseFloat(lon) : undefined;

      await addStory(description, photo, parsedLat, parsedLon, token);
      setSuccess("Cerita berhasil ditambahkan!");
      setDescription("");
      setPhoto(null);
      setLat("");
      setLon("");
      setMapMarker(null);

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Bagian Input Gambar */}
        <div className="form-group">
          <label>Foto Cerita</label>
          {/* Kondisi untuk menampilkan video stream */}
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
                style={{ width: "100%", height: "auto", display: "block" }}
              ></video>
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={takePhoto}
                  style={{ marginRight: "10px" }}
                >
                  Ambil Foto
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  style={{ backgroundColor: "#dc3545" }}
                >
                  Stop Kamera
                </button>
              </div>
            </div>
          )}

          {/* Tombol 'Buka Kamera' hanya ditampilkan jika kamera tidak aktif dan belum ada foto */}
          {!isCameraActive && !photo && (
            <button type="button" onClick={startCamera}>
              Buka Kamera
            </button>
          )}

          {/* Pratinjau gambar setelah diambil atau dipilih */}
          {photo && (
            <div style={{ marginTop: "15px", textAlign: "center" }}>
              <p>Pratinjau Gambar:</p>
              <img
                src={
                  photo instanceof File || photo instanceof Blob
                    ? URL.createObjectURL(photo)
                    : photo
                }
                alt="Pratinjau"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
              <div style={{ marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null);
                    setError(null);
                  }}
                >
                  Ganti Gambar
                </button>
              </div>
            </div>
          )}

          <p style={{ textAlign: "center", margin: "15px 0" }}>atau</p>

          <input
            id="photo-file-input"
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            required={!photo}
            style={{ display: "block" }}
          />
        </div>

        {/* Bagian Peta untuk Latitude dan Longitude */}
        <div className="form-group">
          <label>Pilih Lokasi di Peta (Opsional)</label>
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
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
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
            <input
              id="lat"
              type="number"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              step="any"
            />
            <input
              id="lon"
              type="number"
              placeholder="Longitude"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              step="any"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setLat("");
              setLon("");
              setMapMarker(null);
            }}
            style={{ marginTop: "10px", backgroundColor: "#6c757d" }}
          >
            Hapus Lokasi
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Menambahkan..." : "Tambah Cerita"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default AddStoryPage;
