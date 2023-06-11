import React, { useState, useEffect } from 'react';
import apiInstance from '../services/api'; // Import the apiInstance from your api.js
import Card from './Card/Card';
import Modal from './Modal/Modal';

function MyListPage() {
  const [favoriteAnime, setFavoriteAnime] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);

  useEffect(() => {
    const fetchFavoriteAnime = async () => {
      try {
        const data = await apiInstance.getFavorite();
        setFavoriteAnime(data);
      } catch (error) {
        console.error('Error fetching favorite anime:', error);
      }
    };

    fetchFavoriteAnime();
  }, []);

  const openModal = (anime) => {
    setSelectedAnime(anime);
  };

  const closeModal = () => {
    setSelectedAnime(null);
  };

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4 mt-20">My List</h1>
        <div className="carousel">
          {favoriteAnime.map((anime) => (
            <div key={anime.animeid} onClick={() => openModal(anime)}>
              <Card anime={anime} />
            </div>
          ))}
        </div>
      </div>
      {selectedAnime && (
        <Modal anime={selectedAnime} onClose={closeModal} onRate={() => setShowReviewModal(true)} />
      )}
    </div>
  );
}

export default MyListPage;
