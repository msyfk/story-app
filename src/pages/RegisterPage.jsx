import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useRegisterPresenter from "../presenters/RegisterPresenter"; // Import presenter
import LoadingIndicator from "../components/LoadingIndicator";

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    success,
    handleRegister,
  } = useRegisterPresenter(navigate); // Panggil presenter

  return (
    <div className="form-card">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        {" "}
        {/* Gunakan handleRegister dari presenter */}
        <div className="form-group">
          <label htmlFor="name">Nama</label>
          <input
            id="name"
            type="text"
            placeholder="Masukkan nama Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Mendaftar..." : "Daftar"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Sudah punya akun? <Link to="/login">Login di sini</Link>
      </p>
      {loading && <LoadingIndicator />}
    </div>
  );
};

export default RegisterPage;
