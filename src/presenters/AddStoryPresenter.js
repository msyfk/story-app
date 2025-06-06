// src/presenters/AddStoryPresenter.js
import { useState, useRef, useEffect, useCallback } from "react";
import { addStory } from "../services/storyApi";
import { getToken } from "../utils/auth"; // Pastikan path benar

const useAddStoryPresenter = (navigate) => {
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [mapMarker, setMapMarker] = useState(null);

  const token = getToken();

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  const startCamera = () => {
    setPhoto(null);
    setIsCameraActive(true);
    setError(null);
  };

  useEffect(() => {
    const initializeCamera = async () => {
      if (!videoRef.current) return;
      if (streamRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch {
        setError("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
        setIsCameraActive(false);
      }
    };

    if (isCameraActive) {
      initializeCamera();
    }

    return () => {
      if (streamRef.current) {
        stopCamera();
      }
    };
  }, [isCameraActive, stopCamera]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        setPhoto(blob);
        stopCamera();
      }, "image/jpeg");
    } else {
      setError("Video stream tidak tersedia untuk mengambil foto.");
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      stopCamera();
    }
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setLat(lat.toFixed(6));
    setLon(lng.toFixed(6));
    setMapMarker([lat, lng]);
  };

  const handleClearLocation = () => {
    setLat("");
    setLon("");
    setMapMarker(null);
  };

  useEffect(() => {
    if (!lat && !lon) {
      setMapMarker(null);
    }
  }, [lat, lon]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Anda harus login untuk menambah cerita.");
      setLoading(false);
      return;
    }
    if (!photo) {
      setError("Foto wajib diunggah.");
      setLoading(false);
      return;
    }

    try {
      const parsedLat = lat ? parseFloat(lat) : undefined;
      const parsedLon = lon ? parseFloat(lon) : undefined;

      await addStory(description, photo, parsedLat, parsedLon, token);
      setSuccess("Cerita berhasil ditambahkan!");
      setDescription("");
      setPhoto(null);
      setLat("");
      setLon("");
      setMapMarker(null);

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    description,
    setDescription,
    photo,
    setPhoto,
    lat,
    setLat,
    lon,
    setLon,
    loading,
    error,
    success,
    videoRef,
    canvasRef,
    isCameraActive,
    startCamera,
    takePhoto,
    stopCamera,
    handleFileInputChange,
    handleMapClick,
    handleClearLocation,
    mapMarker,
    handleSubmit,
  };
};

export default useAddStoryPresenter;
