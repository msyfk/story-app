// src/presenters/DetailStoryPresenter.js
import { useState, useEffect } from "react";
import { getStoryDetail } from "../services/storyApi";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

const useDetailStoryPresenter = (storyId) => {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getStoryDetail(storyId);
        setStory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [storyId]);

  const formatDateDistance = (isoString) => {
    if (!isoString) return "";
    return formatDistanceToNow(new Date(isoString), {
      addSuffix: true,
      locale: id,
    });
  };

  return {
    story,
    loading,
    error,
    formatDateDistance,
  };
};

export default useDetailStoryPresenter;
