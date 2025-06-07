import { getToken, logout } from "./utils/auth.js"; //
import { renderNavbar } from "./components/Navbar.js"; //
import { renderHomePage } from "./pages/HomePage.js"; //
import { renderLoginPage } from "./pages/LoginPage.js"; //
import { renderRegisterPage } from "./pages/RegisterPage.js"; //
import { renderAddStoryPage } from "./pages/AddStoryPage.js"; //
import { renderDetailStoryPage } from "./pages/DetailStoryPage.js"; //

let isLoggedIn = !!getToken(); // State global untuk status login
let appRootElement; // Untuk menampung elemen root utama

const updateLoginStatus = (status) => {
  isLoggedIn = status;
  console.log("App.js: Current isLoggedIn status:", isLoggedIn);
  // Render ulang navbar dan halaman saat ini untuk mencerminkan perubahan status login
  renderApplication();
};

const handleLogout = () => {
  logout(); // Hapus token dari localStorage
  updateLoginStatus(false);
  navigateTo("/login");
  console.log("App.js: Pengguna telah logout. isLoggedIn set to false."); //
};

// Fungsi routing sederhana
const navigateTo = (path) => {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      window.location.hash = path;
      renderApplication();
    });
  } else {
    window.location.hash = path;
    renderApplication();
  }
};

const renderApplication = () => {
  const currentHash = window.location.hash.slice(1) || "/";
  console.log("Rendering application for path:", currentHash);

  // Hapus konten yang ada di container
  const container = appRootElement.querySelector(".container");
  if (container) {
    container.innerHTML = ""; // Hapus hanya area konten, bukan navbar
  } else {
    // Jika container tidak ada, buat dan tambahkan
    const newContainer = document.createElement("div");
    newContainer.className = "container";
    newContainer.id = "main-content";
    appRootElement.appendChild(newContainer);
  }

  const mainContentArea = appRootElement.querySelector(".container");

  // Render Navbar
  renderNavbar(appRootElement, isLoggedIn, handleLogout, navigateTo); // Lewatkan navigateTo

  // Render Halaman berdasarkan rute
  if (currentHash === "/") {
    renderHomePage(mainContentArea);
  } else if (currentHash === "/login") {
    renderLoginPage(mainContentArea, updateLoginStatus, navigateTo);
  } else if (currentHash === "/register") {
    renderRegisterPage(mainContentArea, navigateTo);
  } else if (currentHash === "/add") {
    if (isLoggedIn) {
      renderAddStoryPage(mainContentArea, navigateTo);
    } else {
      navigateTo("/login"); // Alihkan ke login jika tidak terautentikasi
    }
  } else if (currentHash.startsWith("/stories/")) {
    const storyId = currentHash.split("/")[2];
    renderDetailStoryPage(mainContentArea, storyId);
  } else {
    // Fallback untuk 404 atau rute yang tidak dikenal
    mainContentArea.innerHTML =
      '<p class="info-message">Halaman tidak ditemukan.</p>';
  }
};

// Inisialisasi aplikasi
export const App = {
  init: (rootElement) => {
    appRootElement = rootElement;

    // Render awal berdasarkan hash saat ini
    renderApplication();

    // Dengarkan perubahan hash untuk render ulang
    window.addEventListener("hashchange", renderApplication);
  },
};
