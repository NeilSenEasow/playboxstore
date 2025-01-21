import './Navbar.css';
import Logo from '../../assets/logo/logo-play.png';

const Navbar = ({ cartCount }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={Logo} alt="Logo" style={{ width: '120px', height: '45px', marginRight: '10px' }} />
      </div>
      <ul className="navbar-menu">
        <li>Home</li>
        <li>Sell</li>
        <li>Buy <span className="dropdown-arrow">▼</span></li>
        <li>Rent</li>
      </ul>
      <div className="navbar-actions">
        <div className="search-container">
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <div className="notifications">
          <span className="notification-icon">🛒</span>
          <span className="notification-badge">{cartCount}</span>
        </div>
        <button className="sign-in-btn">Sign In</button>
      </div>
    </nav>
  );
};

export default Navbar;
