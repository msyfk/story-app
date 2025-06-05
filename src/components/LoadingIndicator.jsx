// src/components/LoadingIndicator.jsx
import React from "react";

const LoadingIndicator = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <p>Memuat...</p>
      {/* Anda bisa menambahkan CSS atau spinner yang lebih menarik di sini */}
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingIndicator;
