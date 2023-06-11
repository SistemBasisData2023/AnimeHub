import React, { useState, useEffect, useRef } from 'react';
import Carousel from 'react-multi-carousel';
import Card from '../Card/Card';
import apiInstance from '../../services/api';

function GenreAnime({ genre, handleCarouselChange, openModal, responsive }) {
  const [animeData, setAnimeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const isFetching = useRef(false);

  useEffect(() => {
    const fetchAnimeData = async () => {
      console.log(`Fetching data for genre: ${genre}`);
      try {
        const data = await apiInstance.getByGenre(genre, currentPage);
        setAnimeData((prevData) => [...prevData, ...data]);
        isFetching.current = false;
      } catch (error) {
        console.error(`Error fetching anime data for genre ${genre}:`, error);
      }
    };
    fetchAnimeData();
  }, [currentPage, genre]);

  const handleGenreCarouselChange = (currentSlide) => {
    const isLastSlide = currentSlide + responsive.desktop.items >= animeData.length;

    if (isLastSlide && !isFetching.current) {
      isFetching.current = true;
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">{genre}</h2>
      <Carousel
        responsive={responsive}
        infinite={false}
        arrows={true}
        autoPlay={false}
        partialVisible={false}
        afterChange={handleGenreCarouselChange}
      >
        {animeData.map((anime) => (
          <div key={anime.id}>
            <Card anime={anime} onClick={() => openModal(anime)} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default GenreAnime;
