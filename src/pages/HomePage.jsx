// src/pages/HomePage.jsx
import React from "react";
import useHomePresenter from "../presenters/HomePresenter"; // Import presenter
import StoryItem from "../components/StoryItem";
import LoadingIndicator from "../components/LoadingIndicator";
import StoryMap from "../components/StoryMap"; // Import StoryMap

const HomePage = () => {
  const { stories, loading, error } = useHomePresenter(); // Panggil presenter

  if (loading) {
    return <LoadingIndicator />; // Tampilkan LoadingIndicator saat memuat
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>; // Tampilkan pesan error jika ada
  }

  return (
    <section className="homepage" aria-labelledby="latest-stories-heading">
      {" "}
      {/* Semantic element section */}
      <h2 id="latest-stories-heading">Cerita Terbaru</h2>{" "}
      {/* Heading untuk aksesibilitas */}
      {/* Kontainer untuk peta */}
      <div className="homepage-map-container">
        {" "}
        {/* Tambahkan kelas baru */}
        <h3>Lokasi Cerita</h3> {/* Sub-heading untuk peta */}
        {stories.length > 0 ? (
          <StoryMap stories={stories} /> // Komponen peta dengan data cerita
        ) : (
          <p className="info-message">
            Tidak ada lokasi cerita untuk ditampilkan di peta.
          </p>
        )}
      </div>
      <div className="story-list">
        {" "}
        {/* Daftar cerita */}
        {stories.length > 0 ? (
          stories.map((story) => <StoryItem key={story.id} story={story} />) // Map StoryItem untuk setiap cerita
        ) : (
          <p className="info-message">Belum ada cerita yang tersedia.</p> // Pesan jika tidak ada cerita
        )}
      </div>
    </section>
  );
};

export default HomePage;
