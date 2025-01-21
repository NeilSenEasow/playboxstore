import { Link } from 'react-router-dom';
import './Navbar.css';
import Logo from '../../assets/logo/logo-play.png';

const Navbar = ({ cartCount }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={Logo} alt="Logo" style={{ width: '120px', height: '45px', marginRight: '10px' }} />
        </Link>
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/sell">Sell</Link>
        </li>
        <li>
          <Link to="/buy">Buy <span className="dropdown-arrow">▼</span></Link>
        </li>
        <li>
          <Link to="/rent">Rent</Link>
        </li>
      </ul>
      <div className="navbar-actions">
        <div className="search-container">
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <div className="notifications">
          <Link to="/cart">
            <span className="notification-icon">🛒</span>
            <span className="notification-badge">{cartCount}</span>
          </Link>
        </div>
        <button className="sign-in-btn">Sign In</button>
      </div>
    </nav>
  );
};

export default Navbar;
