// src/App.jsx
import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AddStoryPage from "./pages/AddStoryPage";
import DetailStoryPage from "./pages/DetailStoryPage";
import Navbar from "./components/Navbar";
import { getToken, logout } from "./utils/auth";
import "./index.css";

function App() {
  // Perhatikan inisialisasi awal. Ini hanya dijalankan sekali saat komponen dimuat.
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken()); //

  useEffect(() => {
    // Log ini akan berjalan setiap kali isLoggedIn berubah
    console.log(
      "App.jsx: Current isLoggedIn status (from useEffect):",
      isLoggedIn
    ); //
  }, [isLoggedIn]);

  // Ubah sedikit handleLoginSuccess di App.jsx untuk logging
  const handleLoginSuccess = () => {
    //
    setIsLoggedIn(true); //
    console.log("App.jsx: handleLoginSuccess called. isLoggedIn set to true."); // Tambahkan ini
  };

  const handleLogout = () => {
    logout(); // Hapus token dari localStorage
    setIsLoggedIn(false); // Set status login menjadi false
    console.log("App.jsx: Pengguna telah logout. isLoggedIn set to false."); //
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} /> {/* */}
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* */}
          <Route
            path="/login"
            element={<LoginPage setIsLoggedIn={handleLoginSuccess} />} // Ganti `setIsLoggedIn` langsung dengan `handleLoginSuccess`
          />
          <Route path="/register" element={<RegisterPage />} /> {/* */}
          {isLoggedIn ? (
            <>
              <Route path="/add" element={<AddStoryPage />} /> {/* */}
              <Route path="/stories/:id" element={<DetailStoryPage />} />{" "}
              {/* */}
            </>
          ) : (
            <Route
              path="/add"
              element={<LoginPage setIsLoggedIn={handleLoginSuccess} />} // Pastikan juga di sini jika ada redirect
            />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
