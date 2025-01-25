import React, { useEffect, useRef, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './GameSection.css';
import Game1 from '../../assets/games/Game1.png';
import Game2 from '../../assets/games/Game2.png';
import Game3 from '../../assets/games/Game3.png';
import Game4 from '../../assets/games/Game4.png';

export const games = [
  {
    id: 1,
    name: 'GOD OF WAR - PS4',
    price: '₹2,349.00',
    image: Game1,
  },
  {
    id: 2,
    name: 'GTA 5 PS5',
    price: '₹1,990.00',
    image: Game2,
  },
  {
    id: 3,
    name: 'GOD OF WAR - PS4',
    price: '₹2,349.00',
    image: Game3,
  },
  {
    id: 4,
    name: 'GTA 5 PS5',
    price: '₹1,990.00',
    image: Game4,
  },
];

const GameSection = ({ games = [], updateCartCount }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

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
