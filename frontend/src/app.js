import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import Card from './components/Card/Card';
import Navbar from './components/Navbar/Navbar';
import Modal from './components/Modal/Modal';
import ReviewModal from './components/ReviewModal/ReviewModal';
import apiInstance from './services/api';

function App() {
  const [animeData, setAnimeData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const data = await apiInstance.getPaginatedAnime(currentPage);
        setAnimeData((prevData) => [...prevData, ...data]);
      } catch (error) {
        console.error('Error fetching anime data:', error);
      }
    };

    fetchAnimeData();
  }, [currentPage]);

  const handleSearch = async (query) => {
    if (query) {
      try {
        const results = await apiInstance.searchAnime(query);
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
      <Navbar onSearch={handleSearch} />
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4 mt-20">Top Rated</h1> 
        <Carousel 
          responsive={responsive} 
          infinite={false} 
          arrows={true} 
          autoPlay={false} 
          partialVisible={false}
          afterChange={(currentSlide) => {
            const newPage = Math.floor(currentSlide / responsive.desktop.items);
            setCurrentPage(newPage + 1);
          }}
        >
          {animeToDisplay.map((anime) => (
            <div key={anime.animeid}>
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

export default App;