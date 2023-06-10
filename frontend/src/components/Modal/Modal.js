import React from 'react';

function Modal({ anime, onClose, onRate }) {
  const { title, img_url, aired, score, synopsis, genre, episodes, popularity, url_link } = anime;

  // Clean up the genre string.
  const formattedGenres = genre.replace(/[\[\]'"]+/g, '').replace(/, /g, ', ');
  const formattedScore = score ? score.toFixed(1) : score;

  const handleClick = (e) => {
    e.stopPropagation();
  }

  return (
    <div className="modal modal-open fixed inset-0 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
      <div className="modal-box flex justify-center w-11/12 max-w-5xl" onClick={handleClick}>
        <div className="w-1/2">
          <img src={img_url} alt={title} className="w-full h-auto" />
        </div>
        <div className="w-1/2 px-4 py-2">
          <h2 className="text-xl">{title}</h2>
          <p><strong>Synopsis:</strong> {synopsis || 'N/A'}</p>
          <p><strong>Genre:</strong> {formattedGenres}</p>
          <p><strong>Episodes:</strong> {episodes}</p>
          <p><strong>Popularity:</strong> {popularity}</p>
          <p><strong>Release Date:</strong> {aired}</p>
          <p><strong>Score:</strong> {formattedScore}</p>
          <a href={url_link} target="_blank" rel="noopener noreferrer" className="btn btn-link">
            Visit MyAnimeList
          </a>
          <button className="btn mt-4" onClick={onRate}>
            Rate this Anime
          </button>
          <div className="modal-action mt-4">
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
