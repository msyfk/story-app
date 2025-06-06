// src/presenters/RegisterPresenter.js
import { useState } from "react";
import { register } from "../services/authApi";

const useRegisterPresenter = (navigate) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await register(name, email, password);
      setSuccess("Registrasi berhasil! Silakan login.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};

export default useRegisterPresenter;
