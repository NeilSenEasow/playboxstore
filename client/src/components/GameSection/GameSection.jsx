import React, { useEffect, useRef, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './GameSection.css';

const GameSection = ({ updateCartCount }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState([]);
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_PROD_BASE_URL}/api/mainProducts`; // Use VITE_PROD_BASE_URL for production
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGames(data.filter(product => product.category === 'Games')); // Filter games from mainProducts
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames(); // Ensure fetchGames is called only once

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (!hasAnimated) {
            setHasAnimated(true);
          }
        } else {
          setIsVisible(false);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '-50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <div 
      className={`game-section ${isVisible ? 'animate-section' : ''}`} 
      ref={sectionRef}
    >
      <h2 className="section-title">
        Latest <span className="highlight">Games</span>
      </h2>
      <div className={`games-grid ${isLoading ? 'loading' : ''}`}>
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          Array.isArray(games) && games.map((game, index) => (
            <ProductCard 
              key={game.id || index}
              product={game}
              onAddToCart={() => updateCartCount(game)}
              style={{ 
                animationDelay: `${index * 0.1}s`
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameSection;
