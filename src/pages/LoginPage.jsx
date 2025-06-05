// src/pages/LoginPage.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import useLoginPresenter from "../presenters/LoginPresenter"; // Import presenter

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  // Menggunakan presenter untuk logika
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  } = useLoginPresenter(onLoginSuccess, navigate); // Pass necessary callbacks/dependencies

  return (
    <div className="form-card">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        {" "}
        {/* Gunakan handleLogin dari presenter */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state melalui presenter
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Masukkan password Anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update state melalui presenter
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Login..." : "Login"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p>
        Belum punya akun? <Link to="/register">Daftar di sini</Link>
      </p>
    </div>
  );
};

export default LoginPage;
