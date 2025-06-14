import { getToken, logout } from "./utils/auth.js";
import { renderNavbar } from "./components/Navbar.js";
import { renderHomePage } from "./pages/HomePage.js";
import { renderLoginPage } from "./pages/LoginPage.js";
import { renderRegisterPage } from "./pages/RegisterPage.js";
import { renderAddStoryPage, stopCamera } from "./pages/AddStoryPage.js";
import { renderDetailStoryPage } from "./pages/DetailStoryPage.js";

let isLoggedIn = !!getToken();
let appRootElement;

const updateLoginStatus = (status) => {
  isLoggedIn = status;
  console.log("App.js: Current isLoggedIn status:", isLoggedIn);
  renderApplication();
};

const handleLogout = () => {
  logout();
  updateLoginStatus(false);
  navigateTo("/login");
  console.log("App.js: Pengguna telah logout. isLoggedIn set to false.");
};

const navigateTo = (path) => {
  // Stop camera if active when navigating away
  if (window.location.hash.slice(1) === "/add") {
    stopCamera();
  }
  
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

  // Create semantic structure if it doesn't exist
  if (!appRootElement.querySelector('header')) {
    const header = document.createElement('header');
    appRootElement.appendChild(header);
  }
  
  if (!appRootElement.querySelector('main')) {
    const main = document.createElement('main');
    main.id = "main-content";
    main.tabIndex = -1; // Make it focusable
    appRootElement.appendChild(main);
  }
  
  if (!appRootElement.querySelector('footer')) {
    const footer = document.createElement('footer');
    appRootElement.appendChild(footer);
  }
  
  // Add skip link if it doesn't exist
  if (!appRootElement.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to content';
    appRootElement.insertBefore(skipLink, appRootElement.firstChild);
    
    skipLink.addEventListener('click', function(event) {
      event.preventDefault();
      skipLink.blur();
      
      const mainContent = document.getElementById('main-content');
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }

  // Clear main content
  const mainContent = appRootElement.querySelector('main');
  mainContent.innerHTML = '';

  // Render Navbar in header
  const header = appRootElement.querySelector('header');
  renderNavbar(header, isLoggedIn, handleLogout, navigateTo);

  // Render page content in main
  if (currentHash === "/") {
    renderHomePage(mainContent);
  } else if (currentHash === "/login") {
    renderLoginPage(mainContent, updateLoginStatus, navigateTo);
  } else if (currentHash === "/register") {
    renderRegisterPage(mainContent, navigateTo);
  } else if (currentHash === "/add") {
    if (isLoggedIn) {
      renderAddStoryPage(mainContent, navigateTo);
    } else {
      navigateTo("/login");
    }
  } else if (currentHash.startsWith("/stories/")) {
    const storyId = currentHash.split("/")[2];
    renderDetailStoryPage(mainContent, storyId);
  } else {
    mainContent.innerHTML = '<p class="info-message">Halaman tidak ditemukan.</p>';
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



