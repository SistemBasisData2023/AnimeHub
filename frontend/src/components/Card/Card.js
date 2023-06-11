import React, { useState } from 'react';

function Card({ anime, onClick }) {
  const { title, img_url, aired, score } = anime;
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return null;
  }
  const formattedScore = score ? score.toFixed(1) : score;

  const airedAndScore = `Aired: ${aired} | Score: ${formattedScore}`;

  return (
    <div className="card bg-base-100 shadow-lg">
      <figure>
        <img src={img_url} alt={title} onError={handleImageError} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{airedAndScore}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={() => onClick(anime)}>
            MORE INFO
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;