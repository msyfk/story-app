# Story App

Aplikasi berbasis web untuk berbagi cerita dengan fitur lokasi. Dibangun dengan JavaScript vanilla dan arsitektur Model-View-Presenter (MVP) menggunakan Webpack sebagai bundler.

## Deskripsi

Story App adalah Progressive Web Application (PWA) yang memungkinkan pengguna untuk berbagi cerita dengan foto dan lokasi geografis. Aplikasi ini dibangun menggunakan JavaScript vanilla dengan arsitektur MVP dan menggunakan Webpack untuk proses bundling.

## Fitur Utama

- 📝 **Berbagi Cerita**: Pengguna dapat menambahkan cerita dengan deskripsi dan foto
- 📍 **Lokasi Geografis**: Menambahkan lokasi pada cerita menggunakan peta interaktif
- 🗺️ **Peta Interaktif**: Menampilkan cerita di peta menggunakan Leaflet.js
- 🔐 **Autentikasi**: Sistem login dan register pengguna
- 🔔 **Push Notifications**: Notifikasi push untuk update terbaru
- 📱 **Progressive Web App**: Dapat diinstal dan bekerja offline
- 🌐 **Offline Support**: Service Worker untuk caching dan offline functionality
- 📸 **Kamera Integration**: Mengambil foto langsung dari kamera atau upload file
- 🎨 **Responsive Design**: Tampilan yang responsif di berbagai perangkat
- ♿ **Accessibility**: Fitur aksesibilitas seperti skip navigation

## Teknologi yang Digunakan

### Frontend
- **JavaScript (ES6+)**: Bahasa pemrograman utama
- **HTML5 & CSS3**: Markup dan styling
- **Leaflet.js**: Library untuk peta interaktif
- **Service Worker API**: Untuk offline functionality
- **Notification API**: Untuk push notifications
- **Camera API**: Untuk akses kamera perangkat
- **Geolocation API**: Untuk mendapatkan lokasi pengguna

### Build Tools
- **Webpack**: Module bundler
- **Babel**: JavaScript transpiler
- **CSS Loader**: Untuk memproses CSS
- **HTML Webpack Plugin**: Untuk generate HTML
- **Copy Webpack Plugin**: Untuk copy static assets
- **Mini CSS Extract Plugin**: Untuk extract CSS ke file terpisah

### Arsitektur
- **Model-View-Presenter (MVP)**: Pola arsitektur untuk pemisahan concerns
- **Single Page Application (SPA)**: Navigasi tanpa reload halaman
- **Progressive Web App (PWA)**: Standar web modern untuk app-like experience
- **Component-based**: Struktur komponen yang modular dan reusable

## Struktur Proyek

```
story-app/
├── src/
│   ├── index.html              # Template HTML utama
│   ├── offline.html            # Halaman offline
│   ├── public/                 # Static assets
│   │   ├── icons/              # Icon untuk PWA
│   │   ├── manifest.json       # Web App Manifest
│   │   └── sw.js              # Service Worker
│   ├── scripts/               # JavaScript source files
│   │   ├── components/        # Komponen UI reusable
│   │   ├── data/             # Data layer dan API calls
│   │   ├── models/           # Model classes (MVP)
│   │   ├── pages/            # Page components
│   │   │   ├── home/         # Halaman beranda
│   │   │   ├── auth/         # Halaman login/register
│   │   │   ├── addStory/     # Halaman tambah cerita
│   │   │   ├── storyDetail/  # Halaman detail cerita
│   │   │   ├── about/        # Halaman tentang
│   │   │   └── app.js        # Main App class
│   │   ├── presenters/       # Presenter classes (MVP)
│   │   ├── routes/           # Routing system
│   │   ├── services/         # API services
│   │   ├── utils/            # Utility functions
│   │   └── index.js          # Entry point
│   └── styles/
│       └── styles.css        # Main stylesheet
├── dist/                     # Build output (generated)
├── webpack.common.js         # Webpack common config
├── webpack.dev.js           # Webpack development config
├── webpack.prod.js          # Webpack production config
├── package.json             # Dependencies dan scripts
├── STUDENT.txt              # Informasi mahasiswa
└── README.md               # Dokumentasi proyek
```

## Instalasi dan Penggunaan

### Prerequisites
- [Node.js](https://nodejs.org/) (versi 14 atau lebih tinggi)
- [npm](https://www.npmjs.com/) (Node package manager)

### Instalasi
1. Clone repository ini:
   ```bash
   git clone https://github.com/msyfk/story-app.git
   cd story-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Untuk menjalankan development server:
```bash
npm run start-dev
```
Aplikasi akan berjalan di `http://localhost:9000`

### Production Build
Untuk membuat production build:
```bash
npm run build
```
File hasil build akan tersimpan di folder `dist/`

### Serve Production Build
Untuk menjalankan production build:
```bash
npm run serve
```

## Scripts yang Tersedia

- `npm run start-dev`: Menjalankan development server dengan hot reload
- `npm run build`: Membuat production build yang dioptimasi
- `npm run serve`: Menjalankan HTTP server untuk production build

## API Endpoints

Aplikasi ini menggunakan Story API dari Dicoding:
- **Base URL**: `https://story-api.dicoding.dev/v1`
- **Authentication**: Bearer Token
- **Endpoints**:
  - `POST /register`: Registrasi pengguna baru
  - `POST /login`: Login pengguna
  - `GET /stories`: Mendapatkan daftar cerita
  - `GET /stories/:id`: Mendapatkan detail cerita
  - `POST /stories`: Menambahkan cerita baru

## Fitur PWA

### Service Worker
- Caching static assets
- Offline page fallback
- Background sync (jika didukung)

### Web App Manifest
- Installable di perangkat mobile
- Custom app icon dan splash screen
- Standalone display mode

### Push Notifications
- Notifikasi untuk update cerita baru
- Permission management
- Background notifications

## Browser Support

- Chrome/Chromium 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Kontribusi

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Proyek ini menggunakan lisensi ISC. Lihat file `LICENSE` untuk detail lebih lanjut.

## Pengembang

- **Nama**: Moh. Musyaffak
- **Email**: 143171049+msyfk@users.noreply.github.com
- **GitHub**: [@msyfk](https://github.com/msyfk)

## Acknowledgments

- [Dicoding](https://dicoding.com) untuk Story API
- [Leaflet](https://leafletjs.com) untuk library peta
- [OpenStreetMap](https://openstreetmap.org) untuk data peta
- [Webpack](https://webpack.js.org) untuk module bundling

