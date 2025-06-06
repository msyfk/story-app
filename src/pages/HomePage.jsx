import React from "react";
import useHomePresenter from "../presenters/HomePresenter"; // Import presenter
import StoryItem from "../components/StoryItem";
import LoadingIndicator from "../components/LoadingIndicator";

const HomePage = () => {
  const { stories, loading, error } = useHomePresenter(); // Panggil presenter

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  return (
    <section className="homepage" aria-labelledby="latest-stories-heading">
      <h2 id="latest-stories-heading">Cerita Terbaru</h2>
      <div className="story-list">
        {stories.length > 0 ? (
          stories.map((story) => <StoryItem key={story.id} story={story} />)
        ) : (
          <p className="info-message">Belum ada cerita yang tersedia.</p>
        )}
      </div>
    </section>
  );
};

export default HomePage;
