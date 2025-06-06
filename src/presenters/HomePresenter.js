// src/presenters/HomePresenter.js
import { useState, useEffect } from "react";
import { getAllStories } from "../services/storyApi";

const useHomePresenter = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const data = await getAllStories();
        setStories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return {
    stories,
    loading,
    error,
  };
};

export default useHomePresenter;
