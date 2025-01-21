import './GameSection.css';
import Game1 from '../../assets/games/Game1.png';
import Game2 from '../../assets/games/Game2.png';
import Game3 from '../../assets/games/Game3.png';
import Game4 from '../../assets/games/Game4.png';

const games = [
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

const GamesSection = ({ updateCartCount }) => {
  return (
    <div className="product-section">
      <h2 className="section-title">
        Featured <span className="highlight">Games</span>
      </h2>
      <div className="games-grid">
        {games.map((game) => (
          <div key={game.id} className="product-card">
            <img src={game.image} alt={game.name} className="product-image" />
            <h3 className="product-name">
              {game.name}
            </h3>
            <p className="product-price">
              <span className="highlight">{game.price}</span>
            </p>
            <div className="product-buttons">
              <button className="btn-secondary">View More</button>
              <button className="btn-primary" onClick={updateCartCount}>Add To Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesSection;
