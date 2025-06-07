import { login } from "../services/authApi.js"; //
import { setToken } from "../utils/auth.js"; //
import { createLoadingIndicator } from "../components/LoadingIndicator.js"; //

export const renderLoginPage = (parentElement, onLoginSuccess, navigateTo) => {
  parentElement.innerHTML = ""; // Hapus konten yang ada

  const formCard = document.createElement("div");
  formCard.className = "form-card"; //
  parentElement.appendChild(formCard);

  const heading = document.createElement("h2");
  heading.textContent = "Login"; //
  formCard.appendChild(heading);

  const form = document.createElement("form");
  formCard.appendChild(form);

  const emailGroup = document.createElement("div");
  emailGroup.className = "form-group"; //
  const emailLabel = document.createElement("label");
  emailLabel.htmlFor = "email";
  emailLabel.textContent = "Email"; //
  const emailInput = document.createElement("input");
  emailInput.type = "email"; //
  emailInput.id = "email";
  emailInput.required = true;
  emailGroup.appendChild(emailLabel);
  emailGroup.appendChild(emailInput);
  form.appendChild(emailGroup);

  const passwordGroup = document.createElement("div");
  passwordGroup.className = "form-group"; //
  const passwordLabel = document.createElement("label");
  passwordLabel.htmlFor = "password";
  passwordLabel.textContent = "Password"; //
  const passwordInput = document.createElement("input");
  passwordInput.type = "password"; //
  passwordInput.id = "password";
  passwordInput.required = true;
  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordInput);
  form.appendChild(passwordGroup);

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.className = "btn-primary"; //
  submitButton.textContent = "Login"; //
  form.appendChild(submitButton);

  let errorMessageElement = null; // Untuk menampung elemen P pesan error
  let loadingIndicatorElement = null; // Untuk menampung indikator loading

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Tampilkan indikator loading
    if (!loadingIndicatorElement) {
      loadingIndicatorElement = createLoadingIndicator();
      formCard.appendChild(loadingIndicatorElement);
    }
    submitButton.disabled = true; // Nonaktifkan tombol saat loading

    // Hapus error sebelumnya
    if (errorMessageElement) {
      errorMessageElement.remove();
      errorMessageElement = null;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const receivedToken = await login(email, password); //
      setToken(receivedToken); //
      console.log("LoginPage: Token set and onLoginSuccess will be called."); //
      onLoginSuccess(true); // Perbarui status login global
      navigateTo("/");
    } catch (err) {
      errorMessageElement = document.createElement("p");
      errorMessageElement.className = "error-message"; //
      errorMessageElement.textContent = err.message;
      formCard.appendChild(errorMessageElement);
    } finally {
      // Sembunyikan indikator loading
      if (loadingIndicatorElement) {
        loadingIndicatorElement.remove();
        loadingIndicatorElement = null;
      }
      submitButton.disabled = false; // Aktifkan tombol
    }
  });

  const registerParagraph = document.createElement("p");
  registerParagraph.innerHTML =
    'Belum punya akun? <a href="#/register">Daftar di sini</a>'; //
  registerParagraph.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("/register");
  });
  formCard.appendChild(registerParagraph);
};
