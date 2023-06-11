import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Cookies from 'js-cookie';

import Card from './components/Card/Card';
import Navbar from './components/Navbar/Navbar';
import Modal from './components/Modal/Modal';
import ReviewModal from './components/ReviewModal/ReviewModal';
import apiInstance from './services/api';
import Login from './components/Login';
import Register from './components/Register';

function MainApp({ isFavoritesPage, handleLogout }) {
  const [animeData, setAnimeData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Define currentPage state

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        let data;
        if (!isFavoritesPage) {
          data = await apiInstance.getPaginatedAnime(currentPage);
        } else {
          data = await apiInstance.getFavorite();
        }
    
        setAnimeData(data);
      } catch (error) {
        console.error('Error fetching anime data:', error);
      }
    };
    fetchAnimeData();
  }, [currentPage, isFavoritesPage]);
  

  const handleSearch = async (query) => {
    if (query) {
      try {
        const results = await apiInstance.searchAnime(query); // Perform search logic
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching for anime:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const openModal = (anime) => {
    setSelectedAnime(anime);
  };

  const closeModal = () => {
    setSelectedAnime(null);
    setShowReviewModal(false);
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const animeToDisplay = searchResults.length > 0 ? searchResults : animeData;

  return (
    <div>
      <Navbar onSearch={handleSearch} onLogout={handleLogout}  />
      <div className="container mx-auto py-6">
        {isFavoritesPage ? (
          <h1 className="text-2xl font-bold mb-4 mt-20">My Favorite Anime</h1>
        ) : (
          <h1 className="text-2xl font-bold mb-4 mt-20">Top Rated</h1>
        )}
        <Carousel 
          responsive={responsive} 
          infinite={false} 
          arrows={true} 
          autoPlay={false} 
          partialVisible={false}
        >
          {animeToDisplay.map((anime) => (
            <div key={anime.id}>
              <Card anime={anime} onClick={() => openModal(anime)} />
            </div>
          ))}
        </Carousel>
      </div>
      <div className="flex">
        <div className="w-1/2">
          {selectedAnime && <Modal anime={selectedAnime} onClose={closeModal} onRate={() => setShowReviewModal(true)} />}
        </div>
        <div className="w-1/2">
          {showReviewModal && (
            <ReviewModal
              anime={selectedAnime}
              onClose={() => setShowReviewModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Cookies.get('isLoggedIn') === 'true');

  const handleLogin = () => {
    Cookies.set('isLoggedIn', 'true', { expires: 7 });
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    Cookies.remove('isLoggedIn');
    setIsLoggedIn(false);
  };

  const handleRegister = () => {
    setIsLoggedIn(false);
  };


  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace={true} /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" /> : <Register onRegister={handleRegister} />}
        />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <MainApp handleLogout={handleLogout} isFavoritesPage={false} />
            ) : (
              <Navigate to="/login" replace={true} state={{ from: 'register' }} />
            )
          }
        />
        <Route
          path="/favorites"
          element={
            isLoggedIn ? (
              <MainApp handleLogout={handleLogout} isFavoritesPage={true} />
            ) : (
              <Navigate to="/login" replace={true} state={{ from: 'register' }} />
            )
          }
        />
      </Routes>
    </Router>
  );
}