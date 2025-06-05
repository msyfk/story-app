// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
// Tidak perlu import logout dari '../utils/auth' di sini lagi,
// karena handleLogout akan diterima dari props (dari App.jsx)

// Menerima isLoggedIn dan handleLogout dari App.jsx sebagai props
const Navbar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();

  const onLogoutClick = () => {
    // Ganti nama fungsi agar tidak bentrok dengan handleLogout
    handleLogout(); // Panggil fungsi logout yang diterima dari App
    navigate("/login"); // Redirect ke halaman login setelah logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Dicoding Story App</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Beranda</Link>
        </li>

        {/* Logika Kondisional PENTING di sini */}
        {isLoggedIn ? ( // Jika pengguna sudah login
          <>
            <li>
              <Link to="/add">Tambah Cerita</Link>
            </li>
            <li>
              <button onClick={onLogoutClick} className="navbar-button">
                Logout
              </button>
            </li>
          </>
        ) : (
          // Jika pengguna belum login
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
