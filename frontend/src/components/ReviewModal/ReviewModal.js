import React, { useEffect, useState } from 'react';
import apiInstance from '../../services/api';

function ReviewModal({ anime, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [score, setScore] = useState(0);

  const fetchReviews = () => {
    apiInstance.getReviewById(anime.animeid).then(response => setReviews(response));
  };

  useEffect(() => {
    fetchReviews();
  }, [anime.animeid]);

  const addReview = async (animeid, score, review) => {
    try {
      const response = await apiInstance.addReview(animeid, score, review);
      if (response && response.success) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleSubmit = () => {
    addReview(anime.animeid, score, reviewText);
    setReviewText('');
    setScore(0);
  };

  return (
    <div className="modal modal-open fixed inset-0 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
      <div className="modal-box flex justify-center w-11/12 max-w-5xl p-4" onClick={e => e.stopPropagation()}>
        <div className="comments-container w-full">
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          {reviews.map(({ id, username, review, score }) => (
            <div className="comment" key={id}>
              <div className="comment-author font-bold">{username}</div>
              <div className="comment-text">{review}</div>
              <div className="comment-score">Score: {score}</div>
            </div>
          ))}
        </div>
        <div className="input-container w-full mt-4">
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Write a comment..."
            rows={4}
            onChange={e => setReviewText(e.target.value)}
            value={reviewText}
          ></textarea>
          <input
            className="input input-bordered w-full mt-2"
            type="number"
            step="0.1"
            placeholder="Enter a score (0-10)"
            onChange={e => setScore(Number(e.target.value))}
            value={score}
          />
          <button className="btn mt-2" onClick={handleSubmit}>Submit Comment</button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
