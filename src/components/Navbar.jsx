// src/components/Navbar.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  //
  const navigate = useNavigate(); //

  useEffect(() => {
    console.log("Navbar.jsx: isLoggedIn prop received:", isLoggedIn); //
    // Tambahkan log ini juga untuk memeriksa kondisi rendering
    if (isLoggedIn) {
      //
      console.log(
        "Navbar.jsx: User is logged in, 'Tambah Cerita' should be visible."
      ); //
    } else {
      //
      console.log(
        "Navbar.jsx: User is NOT logged in, 'Tambah Cerita' should be hidden."
      ); //
    }
  }, [isLoggedIn]); //

  const onLogoutClick = () => {
    //
    handleLogout(); //
    navigate("/login"); //
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

        {isLoggedIn ? ( //
          <>
            <li>
              <Link to="/add">Tambah Cerita</Link> {/* */}
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
