import React from "react";
import { Link } from "react-router-dom";

const StoryCard = ({ story }) => {
  // Fungsi untuk memformat tanggal
  const formatDate = (isoString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(isoString).toLocaleDateString("id-ID", options); // Sesuaikan 'id-ID' untuk format Indonesia
  };

  return (
    <div className="story-card">
      {/* Link ke detail cerita (jika ada, saat ini belum diimplementasikan) */}
      {/* Anda bisa membuat halaman StoryDetailPage.jsx nantinya jika mau */}
      <Link
        to={`/stories/${story.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {story.photoUrl && <img src={story.photoUrl} alt={story.name} />}
        <h3>{story.name}</h3> {/* Teks 1: Nama */}
        <p>
          {story.description.substring(0, 150)}
          {story.description.length > 150 ? "..." : ""}
        </p>{" "}
        {/* Teks 2: Deskripsi */}
        {/* Teks 3: Tanggal dibuat */}
        <p style={{ fontSize: "0.85em", color: "#888", marginTop: "auto" }}>
          Dibuat pada: {formatDate(story.createdAt)}
        </p>
      </Link>
    </div>
  );
};

export default StoryCard;
