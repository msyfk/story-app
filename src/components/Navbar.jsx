// src/components/Navbar.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Navbar.jsx: isLoggedIn prop received:", isLoggedIn); //
    if (isLoggedIn) {
      console.log(
        "Navbar.jsx: User is logged in, 'Tambah Cerita' should be visible."
      ); //
    } else {
      console.log(
        "Navbar.jsx: User is NOT logged in, 'Tambah Cerita' should be hidden."
      ); //
    }
  }, [isLoggedIn]); //

  const onLogoutClick = () => {
    handleLogout(); //
    // Gunakan startViewTransition untuk navigasi logout
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate("/login"); //
      });
    } else {
      navigate("/login"); //
    }
  };

  // Fungsi untuk menangani klik tautan dan memicu transisi tampilan
  const handleNavLinkClick = (e, to) => {
    e.preventDefault(); // Mencegah navigasi default
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(to); // Lakukan navigasi dalam transisi
      });
    } else {
      navigate(to); // Fallback untuk browser yang tidak mendukung View Transitions
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Gunakan onClick handler untuk brand link */}
        <a href="/" onClick={(e) => handleNavLinkClick(e, "/")}>
          Dicoding Story App
        </a>
      </div>
      <ul className="navbar-links">
        <li>
          {/* Gunakan onClick handler untuk Beranda link */}
          <a href="/" onClick={(e) => handleNavLinkClick(e, "/")}>
            Beranda
          </a>
        </li>

        {isLoggedIn ? (
          <>
            <li>
              {/* Gunakan onClick handler untuk Tambah Cerita link */}
              <a href="/add" onClick={(e) => handleNavLinkClick(e, "/add")}>
                Tambah Cerita
              </a>
            </li>
            <li>
              <button onClick={onLogoutClick} className="navbar-button">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              {/* Gunakan onClick handler untuk Login link */}
              <a href="/login" onClick={(e) => handleNavLinkClick(e, "/login")}>
                Login
              </a>
            </li>
            <li>
              {/* Gunakan onClick handler untuk Register link */}
              <a
                href="/register"
                onClick={(e) => handleNavLinkClick(e, "/register")}
              >
                Register
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
