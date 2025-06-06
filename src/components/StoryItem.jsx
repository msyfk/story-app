import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const StoryItem = ({ story }) => {
  const navigate = useNavigate(); // Inisialisasi useNavigate

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

  // Tangani klik untuk item cerita untuk memicu transisi tampilan
  const handleStoryClick = (e) => {
    e.preventDefault(); // Mencegah perilaku tautan default
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(`/stories/${story.id}`);
      });
    } else {
      navigate(`/stories/${story.id}`);
    }
  };

  return (
    <article className="story-item" aria-labelledby={`story-title-${story.id}`}>
      {/* Ubah Link menjadi a tag dengan onClick untuk transisi */}
      <a href={`/stories/${story.id}`} onClick={handleStoryClick}>
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
            Dibuat pada: {formatDate(story.createdAt)}
          </p>
        </div>
      </a>
    </article>
  );
};

export default StoryItem;
