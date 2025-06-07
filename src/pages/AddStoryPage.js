import { addStory } from "../services/storyApi.js"; //
import { getToken } from "../utils/auth.js"; //
import { createLoadingIndicator } from "../components/LoadingIndicator.js"; //
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Memperbaiki masalah ikon marker dengan Webpack (masih relevan)
delete L.Icon.Default.prototype._getIconUrl; //
L.Icon.Default.mergeOptions({
  //
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png", //
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", //
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", //
});

let currentStream = null; // Untuk menampung aliran media
let map = null; // Untuk menampung instance peta Leaflet
let marker = null; // Untuk menampung marker peta

const stopCamera = () => {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
    currentStream = null;
  }
  const videoElement = document.querySelector("#camera-video");
  if (videoElement) {
    videoElement.srcObject = null;
  }
  const cameraControls = document.querySelector("#camera-controls");
  if (cameraControls) {
    cameraControls.innerHTML = `
        <button type="button" id="start-camera-btn" class="btn-secondary">
            Buka Kamera
        </button>
      `;
    document
      .getElementById("start-camera-btn")
      .addEventListener("click", startCamera);
  }
};

const startCamera = async () => {
  const cameraVideoContainer = document.querySelector("#camera-video-container");
  if (!cameraVideoContainer) return;

  // Hapus pratinjau foto yang ada
  const photoPreview = document.querySelector("#photo-preview-container");
  if (photoPreview) photoPreview.innerHTML = "";
  const fileInput = document.getElementById("photo-file-input");
  if (fileInput) fileInput.value = ""; // Kosongkan input file

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

  const videoElement = document.getElementById("camera-video");
  const takePhotoBtn = document.getElementById("take-photo-btn");
  const stopCameraBtn = document.getElementById("stop-camera-btn");

  takePhotoBtn.addEventListener("click", takePhoto);
  stopCameraBtn.addEventListener("click", stopCamera);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    currentStream = stream;
    videoElement.srcObject = stream;
    videoElement.play();
  } catch (err) {
    console.error("Gagal mengakses kamera:", err);
    const errorMessage = document.createElement("p");
    errorMessage.className = "error-message"; //
    errorMessage.textContent =
      "Gagal mengakses kamera. Pastikan izin kamera diberikan."; //
    cameraVideoContainer.innerHTML = ""; // Hapus elemen kamera
    cameraVideoContainer.appendChild(errorMessage);
    stopCamera(); // Pastikan aliran dihentikan
  }
};

let capturedPhoto = null; // Variabel global untuk menyimpan blob/file foto yang diambil

const takePhoto = () => {
  const videoElement = document.getElementById("camera-video");
  const canvasElement = document.getElementById("camera-canvas");
  if (videoElement && canvasElement) {
    const context = canvasElement.getContext("2d");
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    context.translate(canvasElement.width, 0); // Pindahkan titik awal ke kanan
    context.scale(-1, 1); // Membalikkan gambar secara horizontal

    context.drawImage(
      videoElement,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    context.transform(1, 0, 0, 1, 0, 0); // Reset transformasi

    canvasElement.toBlob((blob) => {
      capturedPhoto = blob;
      stopCamera(); // Hentikan kamera setelah mengambil foto
      renderPhotoPreview(); // Tampilkan pratinjau
    }, "image/jpeg");
  } else {
    console.error("Video stream tidak tersedia untuk mengambil foto."); //
  }
};

const renderPhotoPreview = () => {
  const photoPreviewContainer = document.querySelector(
    "#photo-preview-container"
  );
  if (!photoPreviewContainer) return;

  photoPreviewContainer.innerHTML = ""; // Hapus pratinjau sebelumnya

  if (capturedPhoto) {
    photoPreviewContainer.style.display = "flex";
    photoPreviewContainer.style.flexDirection = "column"; // Susun item secara vertikal
    photoPreviewContainer.style.alignItems = "center"; // Tengahkan item secara horizontal (gambar dan tombol)
    photoPreviewContainer.style.width = "100%";

    const previewP = document.createElement("p");
    previewP.textContent = "Pratinjau Gambar:"; //
    previewP.style.marginTop = "15px";
    previewP.style.textAlign = "center";
    photoPreviewContainer.appendChild(previewP);

    const img = document.createElement("img");
    img.src = URL.createObjectURL(capturedPhoto);
    img.alt = "Pratinjau gambar yang akan diunggah";
    img.style.maxWidth = "100%";
    img.style.maxHeight = "200px";
    img.style.objectFit = "contain";
    img.style.borderRadius = "8px";
    img.style.marginBottom = "10px";
    photoPreviewContainer.appendChild(img);

    const buttonDiv = document.createElement("div");
    const changeImageBtn = document.createElement("button");
    changeImageBtn.type = "button";
    changeImageBtn.className = "btn-info"; //
    changeImageBtn.textContent = "Ganti Gambar"; //
    changeImageBtn.addEventListener("click", () => {
      capturedPhoto = null; // Hapus foto yang diambil
      photoPreviewContainer.innerHTML = ""; // Hapus pratinjau
      const startCameraBtnContainer =
        document.querySelector("#camera-controls");
      if (startCameraBtnContainer) {
        startCameraBtnContainer.innerHTML = `
                    <button type="button" id="start-camera-btn" class="btn-secondary">
                        Buka Kamera
                    </button>
                `;
        document
          .getElementById("start-camera-btn")
          .addEventListener("click", startCamera);
      }
    });
    buttonDiv.appendChild(changeImageBtn);
    photoPreviewContainer.appendChild(buttonDiv);
  }
};

export const renderAddStoryPage = (parentElement, navigateTo) => {
  parentElement.innerHTML = ""; // Hapus konten yang ada

  const formCard = document.createElement("div");
  formCard.className = "form-card";
  parentElement.appendChild(formCard);

  const heading = document.createElement("h2");
  heading.textContent = "Tambah Cerita Baru";
  formCard.appendChild(heading);

  const form = document.createElement("form");
  formCard.appendChild(form);

  // Description (kode yang ada)
  const descriptionGroup = document.createElement("div");
  descriptionGroup.className = "form-group";
  const descriptionLabel = document.createElement("label");
  descriptionLabel.htmlFor = "description";
  descriptionLabel.textContent = "Deskripsi Cerita";
  const descriptionTextarea = document.createElement("textarea");
  descriptionTextarea.id = "description";
  descriptionTextarea.placeholder = "Tulis cerita Anda di sini...";
  descriptionTextarea.required = true;
  descriptionTextarea.rows = "6";
  descriptionGroup.appendChild(descriptionLabel);
  descriptionGroup.appendChild(descriptionTextarea);
  form.appendChild(descriptionGroup);

  // Photo Section (kode yang ada)
  const photoFieldset = document.createElement("fieldset");
  photoFieldset.className = "form-group";
  const photoLegend = document.createElement("legend");
  photoLegend.textContent = "Foto Cerita";
  photoFieldset.appendChild(photoLegend);

  const cameraVideoContainer = document.createElement("div");
  cameraVideoContainer.id = "camera-video-container";
  photoFieldset.appendChild(cameraVideoContainer);

  const cameraControlsDiv = document.createElement("div");
  cameraControlsDiv.id = "camera-controls";
  const startCameraBtn = document.createElement("button");
  startCameraBtn.type = "button";
  startCameraBtn.className = "btn-secondary";
  startCameraBtn.textContent = "Buka Kamera";
  startCameraBtn.addEventListener("click", startCamera);
  cameraControlsDiv.appendChild(startCameraBtn);
  cameraVideoContainer.appendChild(cameraControlsDiv);

  const photoPreviewContainer = document.createElement("div");
  photoPreviewContainer.id = "photo-preview-container";
  photoFieldset.appendChild(photoPreviewContainer);

  const orParagraph = document.createElement("p");
  orParagraph.style.textAlign = "center";
  orParagraph.style.margin = "15px 0";
  orParagraph.textContent = "atau";
  photoFieldset.appendChild(orParagraph);

  const fileInputLabel = document.createElement("label");
  fileInputLabel.htmlFor = "photo-file-input";
  fileInputLabel.style.display = "none";
  fileInputLabel.textContent = "Unggah Foto dari Perangkat";
  photoFieldset.appendChild(fileInputLabel);
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "photo-file-input";
  fileInput.accept = "image/*";
  fileInput.style.display = "block";
  fileInput.addEventListener("change", (e) => {
    capturedPhoto = e.target.files[0];
    stopCamera();
    renderPhotoPreview();
  });
  photoFieldset.appendChild(fileInput);
  form.appendChild(photoFieldset);

  // Map Section (kode yang ada)
  const mapFieldset = document.createElement("fieldset");
  mapFieldset.className = "form-group";
  const mapLegend = document.createElement("legend");
  mapLegend.textContent = "Pilih Lokasi di Peta (Opsional)";
  mapFieldset.appendChild(mapLegend);

  const mapDiv = document.createElement("div");
  mapDiv.id = "add-story-map"; // ID for this specific map instance
  mapDiv.style.height = "350px";
  mapDiv.style.width = "100%";
  mapDiv.style.borderRadius = "8px";
  mapDiv.style.marginBottom = "15px";
  mapFieldset.appendChild(mapDiv);

  const latLonDiv = document.createElement("div");
  latLonDiv.style.display = "flex";
  latLonDiv.style.gap = "10px";

  const latInput = document.createElement("input");
  latInput.type = "number";
  latInput.id = "lat";
  latInput.placeholder = "Latitude";
  latInput.step = "any";
  latInput.setAttribute("aria-label", "Latitude");
  latInput.value = "";
  latLonDiv.appendChild(latInput);

  const lonInput = document.createElement("input");
  lonInput.type = "number";
  lonInput.id = "lon";
  lonInput.placeholder = "Longitude";
  lonInput.step = "any";
  lonInput.setAttribute("aria-label", "Longitude");
  lonInput.value = "";
  latLonDiv.appendChild(lonInput);

  mapFieldset.appendChild(latLonDiv);

  const clearLocationBtn = document.createElement("button");
  clearLocationBtn.type = "button";
  clearLocationBtn.className = "btn-info";
  clearLocationBtn.textContent = "Hapus Lokasi";
  clearLocationBtn.style.marginTop = "10px";
  mapFieldset.appendChild(clearLocationBtn);

  form.appendChild(mapFieldset);

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.className = "btn-primary";
  submitButton.textContent = "Tambah Cerita";
  form.appendChild(submitButton);

  let errorMessageElement = null;
  let successMessageElement = null;
  let loadingIndicatorElement = null;

  // Leaflet map initialization
  const defaultMapCenter = [-6.2, 106.8]; // Jakarta

  const initializeMap = () => {
    // *** SOLUSI: Hancurkan peta yang ada jika sudah diinisialisasi ***
    if (map && map.remove) {
      // Pastikan map bukan null dan memiliki metode remove()
      map.remove(); // Hapus instance peta yang ada
      map = null; // Setel ulang variabel map ke null setelah dihapus
      marker = null; // Setel ulang marker juga
      console.log("Existing map on add-story-map removed.");
    }
    map = L.map("add-story-map").setView(defaultMapCenter, 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      latInput.value = lat.toFixed(6);
      lonInput.value = lng.toFixed(6);

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng])
          .addTo(map)
          .bindPopup(
            `Lokasi yang Anda pilih: <br/>Lat: ${lat.toFixed(
              6
            )} <br/>Lon: ${lng.toFixed(6)}`
          )
          .openPopup();
      }
    });
  };

  // Set initial values for lat/lon if already available (e.g. from previous session)
  latInput.addEventListener("input", () => {
    const latVal = parseFloat(latInput.value);
    const lonVal = parseFloat(lonInput.value);
    if (!isNaN(latVal) && !isNaN(lonVal) && map) {
      // Tambahkan pemeriksaan `map`
      if (marker) {
        marker.setLatLng([latVal, lonVal]);
      } else {
        marker = L.marker([latVal, lonVal])
          .addTo(map)
          .bindPopup(
            `Lokasi yang Anda pilih: <br/>Lat: ${latVal} <br/>Lon: ${lonVal}`
          )
          .openPopup();
      }
      map.setView([latVal, lonVal], 10);
    }
  });
  lonInput.addEventListener("input", () => {
    const latVal = parseFloat(latInput.value);
    const lonVal = parseFloat(lonInput.value);
    if (!isNaN(latVal) && !isNaN(lonVal) && map) {
      // Tambahkan pemeriksaan `map`
      if (marker) {
        marker.setLatLng([latVal, lonVal]);
      } else {
        marker = L.marker([latVal, lonVal])
          .addTo(map)
          .bindPopup(
            `Lokasi yang Anda pilih: <br/>Lat: ${latVal} <br/>Lon: ${lonVal}`
          )
          .openPopup();
      }
      map.setView([latVal, lonVal], 10);
    }
  });

  clearLocationBtn.addEventListener("click", () => {
    latInput.value = "";
    lonInput.value = "";
    if (marker) {
      map.removeLayer(marker);
      marker = null;
    }
    if (map) {
      // Tambahkan pemeriksaan `map`
      map.setView(defaultMapCenter, 10);
    }
  });

  // Inisialisasi peta setelah elemen ditambahkan ke DOM
  // Pastikan inisialisasi hanya terjadi sekali saat halaman dimuat
  setTimeout(() => {
    // Periksa apakah elemen peta sudah ada di DOM sebelum menginisialisasi
    if (document.getElementById("add-story-map")) {
      initializeMap();
    }
  }, 0); // Gunakan setTimeout untuk memastikan mapDiv ada di DOM

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!loadingIndicatorElement) {
      loadingIndicatorElement = createLoadingIndicator();
      formCard.appendChild(loadingIndicatorElement);
    }
    submitButton.disabled = true;

    if (errorMessageElement) {
      errorMessageElement.remove();
      errorMessageElement = null;
    }
    if (successMessageElement) {
      successMessageElement.remove();
      successMessageElement = null;
    }

    const token = getToken(); //
    if (!token) {
      //
      errorMessageElement = document.createElement("p");
      errorMessageElement.className = "error-message"; //
      errorMessageElement.textContent =
        "Anda harus login untuk menambah cerita."; //
      formCard.appendChild(errorMessageElement);
      submitButton.disabled = false;
      loadingIndicatorElement.remove();
      loadingIndicatorElement = null;
      return;
    }

    if (!capturedPhoto) {
      //
      errorMessageElement = document.createElement("p");
      errorMessageElement.className = "error-message"; //
      errorMessageElement.textContent = "Foto wajib diunggah."; //
      formCard.appendChild(errorMessageElement);
      submitButton.disabled = false;
      loadingIndicatorElement.remove();
      loadingIndicatorElement = null;
      return;
    }

    const description = descriptionTextarea.value;
    const latValue = latInput.value ? parseFloat(latInput.value) : undefined;
    const lonValue = lonInput.value ? parseFloat(lonInput.value) : undefined;

    try {
      await addStory(description, capturedPhoto, latValue, lonValue, token); //
      successMessageElement = document.createElement("p");
      successMessageElement.className = "success-message"; //
      successMessageElement.textContent = "Cerita berhasil ditambahkan!"; //
      formCard.appendChild(successMessageElement);

      // Kosongkan field form
      descriptionTextarea.value = "";
      capturedPhoto = null;
      photoPreviewContainer.innerHTML = "";
      latInput.value = "";
      lonInput.value = "";
      if (marker) {
        map.removeLayer(marker);
        marker = null;
      }
      map.setView(defaultMapCenter, 10); // Setel ulang tampilan peta

      setTimeout(() => navigateTo("/"), 2000); //
    } catch (err) {
      errorMessageElement = document.createElement("p");
      errorMessageElement.className = "error-message"; //
      errorMessageElement.textContent = err.message;
      formCard.appendChild(errorMessageElement);
    } finally {
      if (loadingIndicatorElement) {
        loadingIndicatorElement.remove();
        loadingIndicatorElement = null;
      }
      submitButton.disabled = false;
    }
  });
};