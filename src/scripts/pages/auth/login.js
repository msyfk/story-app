import { createLoadingIndicator } from "../../components/LoadingIndicator.js";
import { AuthModel } from "../../models/AuthModel.js";
import { LoginPresenter } from "../../presenters/LoginPresenter.js";

class Login {
  constructor() {
    this._authModel = new AuthModel();
    this._loginPresenter = null;
  }

  async render() {
    return `
      <div class="auth-page">
        <div class="form-card">
          <h2>Login</h2>
          <form id="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" required>
            </div>
            <button type="submit" class="btn-primary" id="submit-button">Login</button>
          </form>
          <div id="loading-container"></div>
          <div id="error-container"></div>
          <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
        </div>
      </div>
    `;
  }

  async afterRender() {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = document.getElementById('submit-button');
    const loadingContainer = document.getElementById('loading-container');
    const errorContainer = document.getElementById('error-container');

    let loadingIndicatorElement = null;

    // Create view interface for presenter
    const loginView = {
      showError: (message) => {
        errorContainer.innerHTML = `<p class="error-message">${message}</p>`;
      },
      showLoading: () => {
        if (!loadingIndicatorElement) {
          loadingIndicatorElement = createLoadingIndicator();
          loadingContainer.appendChild(loadingIndicatorElement);
        }
        submitButton.disabled = true;
      },
      hideLoading: () => {
        if (loadingIndicatorElement) {
          loadingIndicatorElement.remove();
          loadingIndicatorElement = null;
        }
        submitButton.disabled = false;
      },
      clearError: () => {
        errorContainer.innerHTML = '';
      }
    };

    // Create presenter
    this._loginPresenter = new LoginPresenter(loginView, this._authModel);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      loginView.clearError();
      loginView.showLoading();

      const email = emailInput.value;
      const password = passwordInput.value;

      try {
        const success = await this._loginPresenter.login(email, password);
        if (success) {
          console.log("Login successful, redirecting to home");
          window.location.hash = '#/';
        }
      } finally {
        loginView.hideLoading();
      }
    });
  }

  cleanup() {
    if (this._loginPresenter) {
      this._loginPresenter = null;
    }
  }
}

export default Login;
