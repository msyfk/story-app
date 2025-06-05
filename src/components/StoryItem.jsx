import React from "react";
import { Link } from "react-router-dom";

const StoryItem = ({ story }) => {
  // Fungsi untuk memformat tanggal
  const formatDate = (isoString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(isoString).toLocaleDateString("id-ID", options);
  };

  return (
    <article className="story-item" aria-labelledby={`story-title-${story.id}`}>
      <Link to={`/stories/${story.id}`}>
        {story.photoUrl && (
          <img
            src={story.photoUrl}
            alt={`Foto cerita: ${
              story.description
                ? story.description.substring(0, 50) + "..."
                : "Gambar cerita"
            }`}
            loading="lazy"
          />
        )}
        <div className="content">
          <h3 id={`story-title-${story.id}`}>{story.name}</h3>
          <p>
            {story.description.substring(0, 150)}
            {story.description.length > 150 ? "..." : ""}
          </p>
          <p
            className="story-meta"
            style={{ marginTop: "auto", paddingTop: "10px", borderTop: "none" }}
          >
            {" "}
            {/* Menggunakan story-meta di sini, dan override border-top */}
            Dibuat pada: {formatDate(story.createdAt)}
          </p>
        </div>
      </Link>
    </article>
  );
};

export default StoryItem;
