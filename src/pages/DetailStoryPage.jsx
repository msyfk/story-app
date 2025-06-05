import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStoryDetail } from "../services/storyApi";
import LoadingIndicator from "../components/LoadingIndicator";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

const DetailStoryPage = () => {
  const { id: storyId } = useParams();
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

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  if (!story) {
    return <p className="info-message">Cerita tidak ditemukan.</p>;
  }

  return (
    <article
      className="detail-story-card"
      aria-labelledby="story-detail-heading"
    >
      {" "}
      {/* Menggunakan kelas .detail-story-card */}
      <h2 id="story-detail-heading">{story.name}</h2>
      <img src={story.photoUrl} alt={`Foto cerita berjudul ${story.name}`} />
      <p>{story.description}</p>
      <div className="story-meta">
        {" "}
        {/* Menggunakan kelas .story-meta */}
        <p>
          Dibuat:{" "}
          {formatDistanceToNow(new Date(story.createdAt), {
            addSuffix: true,
            locale: id,
          })}
        </p>
        {story.lat && story.lon && (
          <p className="location">
            Lokasi: {story.lat}, {story.lon}
          </p>
        )}
      </div>
    </article>
  );
};

export default DetailStoryPage;
