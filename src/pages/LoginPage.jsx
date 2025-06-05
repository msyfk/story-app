// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authApi";
import { setToken } from "../utils/auth";
import LoadingIndicator from "../components/LoadingIndicator"; // Import LoadingIndicator

const LoginPage = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const receivedToken = await login(email, password);
      setToken(receivedToken);
      setIsLoggedIn(true);
      console.log("LoginPage: Login berhasil. setIsLoggedIn(true) dipanggil.");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      {" "}
      {/* Menggunakan kelas .form-card */}
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          {" "}
          {/* Menggunakan kelas .form-group */}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          {" "}
          {/* Menggunakan kelas .form-group */}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {" "}
          {/* Menggunakan kelas .btn-primary */}
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <p>
        Belum punya akun? <Link to="/register">Daftar di sini</Link>
      </p>
      {loading && <LoadingIndicator />}{" "}
      {/* Tampilkan loading saat proses login */}
    </div>
  );
};

export default LoginPage;
