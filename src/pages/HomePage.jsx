import React, { useEffect, useState } from "react";
import { getAllStories } from "../services/storyApi";
import { getToken } from "../utils/auth";
import StoryCard from "../components/StoryCard";
import LoadingSpinner from "../components/LoadingSpinner";
import StoryMap from "../components/StoryMap"; // Import komponen peta
import { Link } from "react-router-dom";

// Import useHomePagePresenter (jika sudah diimplementasikan MVP untuk HomePage)
// import useHomePagePresenter from '../presenters/HomePagePresenter';

const HomePage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getToken();

  useEffect(() => {
    if (!token) {
      setError("Anda harus login untuk melihat cerita.");
      setLoading(false);
      return;
    }

    const fetchStories = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedStories = await getAllStories(token);
        setStories(fetchedStories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [token]);

  // --- Jika Anda mengimplementasikan MVP untuk HomePage, bagian ini akan berubah ---
  // const { stories, loading, error } = useHomePagePresenter(token);
  // --- End MVP consideration ---

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="container error-message">Error: {error}</div>;
  }

  // Filter cerita yang memiliki koordinat untuk ditampilkan di peta
  const storiesWithLocation = stories.filter(
    (story) => story.lat !== null && story.lon !== null
  );

  return (
    <div>
      <h2>Peta Cerita</h2>
      {storiesWithLocation.length > 0 ? (
        <div style={{ marginBottom: "40px" }}>
          {" "}
          {/* Tambahkan margin bawah untuk peta */}
          <StoryMap stories={storiesWithLocation} />
        </div>
      ) : (
        <p>
          Tidak ada cerita dengan lokasi yang tersedia untuk ditampilkan di
          peta.
        </p>
      )}

      <h2>Daftar Cerita</h2>
      {stories.length === 0 ? (
        <p>
          Tidak ada cerita yang tersedia. Mari{" "}
          <Link to="/add">tambahkan cerita baru</Link>!
        </p>
      ) : (
        <div className="stories-grid">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
