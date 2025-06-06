// src/presenters/LoginPresenter.js
import { useState } from "react";
import { login } from "../services/authApi"; // Sudah diperbaiki sebelumnya
import { setToken } from "../utils/auth"; // PERBAIKAN DI SINI

const useLoginPresenter = (onLoginSuccess, navigate) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const receivedToken = await login(email, password); // Model Interaction
      setToken(receivedToken); // PERBAIKAN DI SINI: Gunakan setToken dan langsung passing receivedToken
      onLoginSuccess();
      navigate("/"); // View navigation
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Expose state and handlers to the View
  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  };
};

export default useLoginPresenter;
