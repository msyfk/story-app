// src/presenters/LoginPresenter.js
import { useState } from "react";
import { login } from "../services/authApi";
import { setToken } from "../utils/auth";

const useLoginPresenter = (onLoginSuccess, navigate) => {
  //
  const [email, setEmail] = useState(""); //
  const [password, setPassword] = useState(""); //
  const [loading, setLoading] = useState(false); //
  const [error, setError] = useState(null); //

  const handleLogin = async (e) => {
    //
    e.preventDefault(); //
    setLoading(true); //
    setError(null); //
    try {
      const receivedToken = await login(email, password); //
      setToken(receivedToken); //
      console.log(
        "LoginPresenter: Token set and onLoginSuccess will be called."
      ); // Tambahkan ini
      onLoginSuccess(); // <-- Ini yang akan memanggil setIsLoggedIn(true) di App.jsx
      navigate("/"); //
    } catch (err) {
      setError(err.message); //
    } finally {
      setLoading(false); //
    }
  };

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
