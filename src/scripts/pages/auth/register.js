import { register } from "../../services/authApi.js";
import { createLoadingIndicator } from "../../components/LoadingIndicator.js";

class Register {
  constructor() {
    // Constructor
  }

  async render() {
    return `
      <div class="auth-page">
        <div class="form-card">
          <h2>Register</h2>
          <form id="register-form">
            <div class="form-group">
              <label for="name">Nama</label>
              <input type="text" id="name" placeholder="Masukkan nama Anda" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="Masukkan email Anda" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" placeholder="Masukkan password Anda" required>
            </div>
            <button type="submit" class="btn-primary" id="submit-button">Daftar</button>
          </form>
          <div id="loading-container"></div>
          <div id="message-container"></div>
          <p style="text-align: center; margin-top: 20px;">
            Sudah punya akun? <a href="#/login">Login di sini</a>
          </p>
        </div>
      </div>
    `;
  }

  async afterRender() {
    const form = document.getElementById('register-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = document.getElementById('submit-button');
    const loadingContainer = document.getElementById('loading-container');
    const messageContainer = document.getElementById('message-container');

    let loadingIndicatorElement = null;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!loadingIndicatorElement) {
        loadingIndicatorElement = createLoadingIndicator();
        loadingContainer.appendChild(loadingIndicatorElement);
      }
      submitButton.disabled = true;

      // Clear previous messages
      messageContainer.innerHTML = '';

      const name = nameInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;

      try {
        await register(name, email, password);
        messageContainer.innerHTML = '<p class="success-message">Registrasi berhasil! Silakan login.</p>';

        setTimeout(() => {
          window.location.hash = '#/login';
        }, 2000);
      } catch (err) {
        messageContainer.innerHTML = `<p class="error-message">${err.message}</p>`;
      } finally {
        if (loadingIndicatorElement) {
          loadingIndicatorElement.remove();
          loadingIndicatorElement = null;
        }
        submitButton.disabled = false;
      }
    });
  }

  cleanup() {
    // Cleanup any resources if needed
  }
}

export default Register;
