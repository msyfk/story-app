class About {
  constructor() {
    // Constructor
  }

  async render() {
    return `
      <div class="about-page">
        <div class="about-header">
          <h2>Tentang Story App</h2>
        </div>
        <div class="about-content">
          <div class="about-section">
            <h3>Apa itu Story App?</h3>
            <p>
              Story App adalah aplikasi web progresif (PWA) yang memungkinkan pengguna untuk berbagi cerita 
              dengan lokasi geografis. Aplikasi ini dibangun menggunakan JavaScript vanilla dengan arsitektur 
              Model-View-Presenter (MVP) dan menggunakan Webpack sebagai bundler.
            </p>
          </div>
          
          <div class="about-section">
            <h3>Fitur Utama</h3>
            <ul>
              <li>📝 Berbagi cerita dengan foto</li>
              <li>📍 Menambahkan lokasi pada cerita</li>
              <li>🗺️ Melihat cerita di peta interaktif</li>
              <li>🔔 Notifikasi push</li>
              <li>📱 Progressive Web App (PWA)</li>
              <li>🌐 Bekerja offline</li>
              <li>🔐 Sistem autentikasi pengguna</li>
            </ul>
          </div>
          
          <div class="about-section">
            <h3>Teknologi yang Digunakan</h3>
            <div class="tech-stack">
              <div class="tech-item">
                <h4>Frontend</h4>
                <ul>
                  <li>JavaScript (ES6+)</li>
                  <li>HTML5 & CSS3</li>
                  <li>Leaflet.js (untuk peta)</li>
                  <li>Service Worker</li>
                </ul>
              </div>
              <div class="tech-item">
                <h4>Build Tools</h4>
                <ul>
                  <li>Webpack</li>
                  <li>Babel</li>
                  <li>CSS Loader</li>
                  <li>HTML Webpack Plugin</li>
                </ul>
              </div>
              <div class="tech-item">
                <h4>Arsitektur</h4>
                <ul>
                  <li>Model-View-Presenter (MVP)</li>
                  <li>Single Page Application (SPA)</li>
                  <li>Progressive Web App (PWA)</li>
                  <li>Responsive Design</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="about-section">
            <h3>Pengembang</h3>
            <p>
              Aplikasi ini dikembangkan sebagai bagian dari pembelajaran pengembangan web intermediate.
              Untuk informasi lebih lanjut, silakan kunjungi repository GitHub kami.
            </p>
            <div class="developer-links">
              <a href="https://github.com/msyfk/story-app" target="_blank" rel="noopener noreferrer">
                📂 GitHub Repository
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    // Add any interactive functionality here if needed
    console.log('About page rendered');
  }

  cleanup() {
    // Cleanup any resources if needed
  }
}

export default About;
