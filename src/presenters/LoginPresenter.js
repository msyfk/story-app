// src/presenters/LoginPresenter.js
import { useState } from "react";
import { login } from "../services/storyApi";
import { saveToken } from "../utils/auth";

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
      const result = await login(email, password); // Model Interaction
      saveToken(result.token); // Model Interaction
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
