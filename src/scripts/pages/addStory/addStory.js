import { addStory } from "../../services/storyApi.js";
import { getToken } from "../../utils/auth.js";
import { createLoadingIndicator } from "../../components/LoadingIndicator.js";

class AddStory {
  constructor() {
    this.currentStream = null;
    this.map = null;
    this.marker = null;
    this.capturedPhoto = null;
  }

  async render() {
    return `
      <div class="add-story-page">
        <div class="form-card">
          <h2>Tambah Cerita Baru</h2>
          <form id="add-story-form">
            <div class="form-group">
              <label for="description">Deskripsi Cerita</label>
              <textarea id="description" placeholder="Tulis cerita Anda di sini..." required rows="6"></textarea>
            </div>
            
            <fieldset class="form-group">
              <legend>Foto Cerita</legend>
              <div id="camera-video-container">
                <div id="camera-controls">
                  <button type="button" id="start-camera-btn" class="btn-secondary">Buka Kamera</button>
                </div>
              </div>
              <div id="photo-preview-container"></div>
              <p style="text-align: center; margin: 15px 0;">atau</p>
              <input type="file" id="photo-file-input" accept="image/*" style="display: block;">
            </fieldset>
            
            <fieldset class="form-group">
              <legend>Lokasi Cerita (Opsional)</legend>
              <div id="add-story-map" style="height: 300px; width: 100%; margin-bottom: 15px; border-radius: 8px; z-index: 0;"></div>
              <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                <div style="flex: 1;">
                  <label for="lat-input">Latitude</label>
                  <input type="text" id="lat-input" placeholder="Klik peta untuk mengisi">
                </div>
                <div style="flex: 1;">
                  <label for="lon-input">Longitude</label>
                  <input type="text" id="lon-input" placeholder="Klik peta untuk mengisi">
                </div>
              </div>
              <button type="button" id="clear-location-btn" class="btn-info" style="width: auto;">Hapus Lokasi</button>
            </fieldset>
            
            <button type="submit" class="btn-primary" id="submit-button">Tambah Cerita</button>
          </form>
          <div id="loading-container"></div>
          <div id="message-container"></div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    // Check if user is authenticated
    const token = getToken();
    if (!token) {
      window.location.hash = '#/login';
      return;
    }

    this.setupEventListeners();
    this.initializeMap();
  }

  setupEventListeners() {
    const form = document.getElementById('add-story-form');
    const startCameraBtn = document.getElementById('start-camera-btn');
    const fileInput = document.getElementById('photo-file-input');
    const clearLocationBtn = document.getElementById('clear-location-btn');
    const latInput = document.getElementById('lat-input');
    const lonInput = document.getElementById('lon-input');

    startCameraBtn.addEventListener('click', () => this.startCamera());
    fileInput.addEventListener('change', (e) => this.handleFileInput(e));
    clearLocationBtn.addEventListener('click', () => this.clearLocation());
    form.addEventListener('submit', (e) => this.handleSubmit(e));

    latInput.addEventListener('input', () => this.updateMapFromInputs());
    lonInput.addEventListener('input', () => this.updateMapFromInputs());
  }

  async startCamera() {
    const cameraVideoContainer = document.getElementById('camera-video-container');
    const photoPreview = document.getElementById('photo-preview-container');
    const fileInput = document.getElementById('photo-file-input');
    
    if (photoPreview) photoPreview.innerHTML = "";
    if (fileInput) fileInput.value = "";

    cameraVideoContainer.innerHTML = `
      <video id="camera-video" autoplay playsInline muted
          style="width: 100%; height: auto; display: block; transform: scaleX(-1);">
      </video>
      <canvas id="camera-canvas" style="display: none;"></canvas>
      <div id="camera-controls" style="display: flex; justify-content: center; padding: 10px; gap: 10px;">
          <button type="button" id="take-photo-btn" class="btn-secondary">Ambil Foto</button>
          <button type="button" id="stop-camera-btn" class="btn-danger">Stop Kamera</button>
      </div>
    `;

    const videoElement = document.getElementById('camera-video');
    const takePhotoBtn = document.getElementById('take-photo-btn');
    const stopCameraBtn = document.getElementById('stop-camera-btn');

    takePhotoBtn.addEventListener('click', () => this.takePhoto());
    stopCameraBtn.addEventListener('click', () => this.stopCamera());

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.currentStream = stream;
      videoElement.srcObject = stream;
      videoElement.play();
    } catch (err) {
      console.error("Gagal mengakses kamera:", err);
      cameraVideoContainer.innerHTML = `
        <div id="camera-controls">
          <button type="button" id="start-camera-btn" class="btn-secondary">Buka Kamera</button>
        </div>
        <p class="error-message">Gagal mengakses kamera. Pastikan izin kamera diberikan.</p>
      `;
      document.getElementById('start-camera-btn').addEventListener('click', () => this.startCamera());
    }
  }

  stopCamera() {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => track.stop());
      this.currentStream = null;
    }
    
    const cameraVideoContainer = document.getElementById('camera-video-container');
    if (cameraVideoContainer) {
      cameraVideoContainer.innerHTML = `
        <div id="camera-controls">
          <button type="button" id="start-camera-btn" class="btn-secondary">Buka Kamera</button>
        </div>
      `;
      document.getElementById('start-camera-btn').addEventListener('click', () => this.startCamera());
    }
  }

  takePhoto() {
    const videoElement = document.getElementById('camera-video');
    const canvasElement = document.getElementById('camera-canvas');
    
    if (videoElement && canvasElement) {
      const context = canvasElement.getContext('2d');
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      context.translate(canvasElement.width, 0);
      context.scale(-1, 1);
      context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      context.transform(1, 0, 0, 1, 0, 0);

      canvasElement.toBlob((blob) => {
        this.capturedPhoto = blob;
        this.stopCamera();
        this.renderPhotoPreview();
      }, 'image/jpeg');
    }
  }

  handleFileInput(e) {
    this.capturedPhoto = e.target.files[0];
    this.stopCamera();
    this.renderPhotoPreview();
  }

  renderPhotoPreview() {
    const photoPreviewContainer = document.getElementById('photo-preview-container');
    if (!photoPreviewContainer || !this.capturedPhoto) return;

    photoPreviewContainer.innerHTML = `
      <p style="margin-top: 15px; text-align: center;">Pratinjau Gambar:</p>
      <img src="${URL.createObjectURL(this.capturedPhoto)}" 
           alt="Pratinjau gambar yang akan diunggah"
           style="max-width: 100%; max-height: 200px; object-fit: contain; border-radius: 8px; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;">
      <div style="text-align: center;">
        <button type="button" class="btn-info" id="change-image-btn">Ganti Gambar</button>
      </div>
    `;

    document.getElementById('change-image-btn').addEventListener('click', () => {
      this.capturedPhoto = null;
      photoPreviewContainer.innerHTML = '';
      this.stopCamera();
    });
  }

  initializeMap() {
    const defaultMapCenter = [-6.2, 106.8];
    
    if (this.map && this.map.remove) {
      this.map.remove();
      this.map = null;
      this.marker = null;
    }

    this.map = window.L ? window.L.map('add-story-map').setView(defaultMapCenter, 10) : null;
    
    if (this.map) {
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      this.map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        const latInput = document.getElementById('lat-input');
        const lonInput = document.getElementById('lon-input');
        
        latInput.value = lat.toFixed(6);
        lonInput.value = lng.toFixed(6);

        if (this.marker) {
          this.marker.setLatLng([lat, lng]);
        } else {
          this.marker = window.L.marker([lat, lng])
            .addTo(this.map)
            .bindPopup(`Lokasi yang Anda pilih: <br/>Lat: ${lat.toFixed(6)} <br/>Lon: ${lng.toFixed(6)}`)
            .openPopup();
        }
      });
    }
  }

  updateMapFromInputs() {
    const latInput = document.getElementById('lat-input');
    const lonInput = document.getElementById('lon-input');
    const latVal = parseFloat(latInput.value);
    const lonVal = parseFloat(lonInput.value);
    
    if (!isNaN(latVal) && !isNaN(lonVal) && this.map) {
      if (this.marker) {
        this.marker.setLatLng([latVal, lonVal]);
      } else {
        this.marker = window.L.marker([latVal, lonVal]).addTo(this.map);
      }
      this.map.setView([latVal, lonVal], 10);
    }
  }

  clearLocation() {
    const latInput = document.getElementById('lat-input');
    const lonInput = document.getElementById('lon-input');
    
    latInput.value = '';
    lonInput.value = '';
    
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
    
    if (this.map) {
      this.map.setView([-6.2, 106.8], 10);
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const messageContainer = document.getElementById('message-container');
    const loadingContainer = document.getElementById('loading-container');
    const submitButton = document.getElementById('submit-button');
    
    messageContainer.innerHTML = '';
    
    const loadingIndicator = createLoadingIndicator();
    loadingContainer.appendChild(loadingIndicator);
    submitButton.disabled = true;

    const token = getToken();
    if (!token) {
      messageContainer.innerHTML = '<p class="error-message">Anda harus login untuk menambah cerita.</p>';
      loadingIndicator.remove();
      submitButton.disabled = false;
      return;
    }

    if (!this.capturedPhoto) {
      messageContainer.innerHTML = '<p class="error-message">Foto wajib diunggah.</p>';
      loadingIndicator.remove();
      submitButton.disabled = false;
      return;
    }

    const description = document.getElementById('description').value;
    const lat = document.getElementById('lat-input').value;
    const lon = document.getElementById('lon-input').value;

    try {
      await addStory(description, this.capturedPhoto, lat, lon, token);
      messageContainer.innerHTML = '<p class="success-message">Cerita berhasil ditambahkan!</p>';
      
      // Reset form
      document.getElementById('description').value = '';
      this.capturedPhoto = null;
      document.getElementById('photo-preview-container').innerHTML = '';
      this.clearLocation();
      
      setTimeout(() => {
        window.location.hash = '#/';
      }, 2000);
    } catch (err) {
      messageContainer.innerHTML = `<p class="error-message">${err.message}</p>`;
    } finally {
      loadingIndicator.remove();
      submitButton.disabled = false;
    }
  }

  cleanup() {
    this.stopCamera();
    if (this.map && this.map.remove) {
      this.map.remove();
      this.map = null;
      this.marker = null;
    }
  }
}

export default AddStory;
