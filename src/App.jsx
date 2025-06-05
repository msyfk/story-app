import React, { useState, useEffect } from "react";
// Ubah BrowserRouter menjadi HashRouter
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AddStoryPage from "./pages/AddStoryPage";
import { getToken, removeToken } from "./utils/auth";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!getToken());
    };
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  return (
    // Ganti BrowserRouter dengan HashRouter
    <Router>
      <div className="app-wrapper">
        <nav>
          <div className="nav-links">
            <Link to="/">Home</Link>
            {isAuthenticated && <Link to="/add">Tambah Cerita</Link>}
          </div>
          <div className="nav-auth">
            {isAuthenticated ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </nav>

        <div className="content-container">
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
            />

            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <HomePage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/add"
              element={
                isAuthenticated ? (
                  <AddStoryPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            {/* Anda bisa menambahkan rute detail cerita di sini */}
            {/* <Route 
              path="/stories/:id" 
              element={isAuthenticated ? <StoryDetailPage /> : <Navigate to="/login" replace />} 
            /> */}
          </Routes>
        </div>

        <footer className="app-footer">
          <p>&copy; 2025 StoryApp. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
