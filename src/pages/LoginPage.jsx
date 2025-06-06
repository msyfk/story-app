// src/pages/LoginPage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useLoginPresenter from "../presenters/LoginPresenter";
import LoadingIndicator from "../components/LoadingIndicator";

const LoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  } = useLoginPresenter(setIsLoggedIn, navigate);

  return (
    <div className="form-card">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
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
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <p>
        Belum punya akun? <Link to="/register">Daftar di sini</Link>
      </p>
      {loading && <LoadingIndicator />}
    </div>
  );
};

export default LoginPage;
