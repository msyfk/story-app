import React from "react";
import { useParams } from "react-router-dom";
import useDetailStoryPresenter from "../presenters/DetailStoryPresenter"; // Import presenter
import LoadingIndicator from "../components/LoadingIndicator";

const DetailStoryPage = () => {
  const { id: storyId } = useParams();
  const { story, loading, error, formatDateDistance } =
    useDetailStoryPresenter(storyId); // Panggil presenter

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
      <h2 id="story-detail-heading">{story.name}</h2>
      <img src={story.photoUrl} alt={`Foto cerita berjudul ${story.name}`} />
      <p>{story.description}</p>
      <div className="story-meta">
        <p>
          Dibuat: {formatDateDistance(story.createdAt)}{" "}
          {/* Gunakan fungsi dari presenter */}
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
