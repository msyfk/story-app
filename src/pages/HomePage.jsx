import React, { useEffect, useState } from 'react';
import { getAllStories } from '../services/storyApi';
import StoryItem from '../components/StoryItem'; 
import LoadingIndicator from '../components/LoadingIndicator'; 

const HomePage = () => {
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

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  return (
    <section aria-labelledby="latest-stories-heading"> 
      <h2 id="latest-stories-heading">Cerita Terbaru</h2>
      <div className="story-list">
        {stories.length > 0 ? (
          stories.map(story => (
            <StoryItem key={story.id} story={story} />
          ))
        ) : (
          <p>Belum ada cerita yang tersedia.</p>
        )}
      </div>
    </section>
  );
};

export default HomePage;