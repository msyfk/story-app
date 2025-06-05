import React from 'react';
import { Link } from 'react-router-dom';

const StoryItem = ({ story }) => {
  return (
    <article className="story-item" aria-labelledby={`story-title-${story.id}`}> 
      <Link to={`/stories/${story.id}`}>
        <img 
          src={story.photoUrl} 
          alt={`Foto cerita: ${story.description ? story.description.substring(0, 50) + '...' : 'Gambar cerita'}`} 
          loading="lazy" 
        />
        <div className="content">
          <h3 id={`story-title-${story.id}`}>{story.name}</h3>
          <p>{story.description.substring(0, 100)}...</p>
        </div>
      </Link>
    </article>
  );
};

export default StoryItem;