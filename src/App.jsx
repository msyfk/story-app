// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  HashRouter as Router, // Pastikan ini HashRouter jika itu pilihan Anda
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AddStoryPage from "./pages/AddStoryPage";
import DetailStoryPage from "./pages/DetailStoryPage";
import Navbar from "./components/Navbar";
import { getToken, logout } from "./utils/auth";
import "./index.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  useEffect(() => {
    console.log("App.jsx: Current isLoggedIn status:", isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout(); // Hapus token dari localStorage
    setIsLoggedIn(false); // Set status login menjadi false
    console.log("App.jsx: Pengguna telah logout. isLoggedIn set to false.");
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/register" element={<RegisterPage />} />

          {isLoggedIn ? (
            <>
              <Route path="/add" element={<AddStoryPage />} />
              <Route path="/stories/:id" element={<DetailStoryPage />} />
            </>
          ) : (
            // Opsional: Redirect ke login jika mencoba mengakses /add tanpa login
            <Route
              path="/add"
              element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
            />
            // Atau jika tidak ingin redirect, biarkan null atau tampilkan pesan "Login dibutuhkan" di AddStoryPage itu sendiri
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
