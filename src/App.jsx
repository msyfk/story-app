// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"; // Pastikan useNavigate diimpor jika diperlukan di App.jsx
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AddStoryPage from "./pages/AddStoryPage";
import DetailStoryPage from "./pages/DetailStoryPage";
import Navbar from "./components/Navbar"; // Pastikan Navbar diimpor
import { getToken, logout } from "./utils/auth"; // Import getToken dan logout
import "./index.css"; // Pastikan CSS diimpor

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("App.jsx: useEffect berjalan untuk cek token...");
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      console.log("App.jsx: Token ditemukan. isLoggedIn set to true.");
    } else {
      setIsLoggedIn(false);
      console.log("App.jsx: Token tidak ditemukan. isLoggedIn set to false.");
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    logout(); // Hapus token dari localStorage
    setIsLoggedIn(false); // Set status login menjadi false
    console.log("App.jsx: Pengguna telah logout. isLoggedIn set to false.");
    // Tidak ada navigate di sini karena navigate hanya bisa di dalam komponen yang di-render oleh Router
    // Navigasi setelah logout akan ditangani di Navbar atau di LoginPage
  };

  if (loading) {
    return <div>Loading aplikasi...</div>;
  }

  return (
    <Router>
      {/* Penting: Meneruskan isLoggedIn dan handleLogout ke Navbar sebagai props */}
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Meneruskan setIsLoggedIn ke LoginPage agar bisa memperbarui status login App */}
          <Route
            path="/login"
            element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/register" element={<RegisterPage />} />

          {/* Lindungi rute yang hanya bisa diakses saat login */}
          {/* Untuk lebih kuat, bisa pakai ProtectedRoute component */}
          {isLoggedIn ? (
            <>
              <Route path="/add" element={<AddStoryPage />} />
              <Route path="/stories/:id" element={<DetailStoryPage />} />
            </>
          ) : // Opsional: Jika belum login, redirect ke login page saat mencoba mengakses /add
          // Atau Anda bisa merender komponen pesan "harap login"
          // <Route path="/add" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          null // Biarkan saja jika Anda ingin AddStoryPage menampilkan pesan sendiri
          }

          {/* Tambahkan rute untuk 404 Not Found jika Anda memilikinya */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
