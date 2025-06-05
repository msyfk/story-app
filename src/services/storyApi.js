const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fungsi helper untuk penanganan response API
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

// Fungsi untuk registrasi pengguna baru
export const register = async (name, email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

// Fungsi untuk login pengguna
export const login = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    return data.loginResult; // Berisi token dan user info
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Fungsi untuk mengambil semua cerita
export const getAllStories = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/stories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await handleResponse(response);
    return data.listStory;
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }
};

// Fungsi untuk mengambil detail cerita berdasarkan ID
export const getStoryDetail = async (id, token) => {
  try {
    const response = await fetch(`${BASE_URL}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await handleResponse(response);
    return data.story;
  } catch (error) {
    console.error(`Error fetching story detail for ID ${id}:`, error);
    throw error;
  }
};

// Fungsi untuk menambah cerita baru
export const addStory = async (description, photo, lat, lon, token) => {
  try {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);
    if (lat !== undefined && lat !== null) formData.append("lat", lat);
    if (lon !== undefined && lon !== null) formData.append("lon", lon);

    const response = await fetch(`${BASE_URL}/stories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error adding story:", error);
    throw error;
  }
};
