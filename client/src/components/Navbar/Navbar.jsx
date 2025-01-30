import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import Logo from '../../assets/logo/logo-play.png';
import { useState } from 'react';
import { BsCart4 } from 'react-icons/bs';

const Navbar = ({ cartCount, onSearch, isAuthenticated, onSignOut }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Redirect to Google Custom Search results page with the query
    window.location.href = `https://googlecustomsearch.appspot.com/elementv2/two-page_results_elements_v2.html?query=${encodeURIComponent(searchQuery)}`;
  };

  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleSignOutClick = () => {
    onSignOut(); // Call the sign-out function passed as a prop
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={Logo} alt="Logo" style={{ width: '120px', height: '45px' }} />
        </Link>
      </div>

      <ul className="navbar-menu">
        <li><Link to="/" className="nav-button">Home</Link></li>
        <li><Link to="/sell" className="nav-button">Sell</Link></li>
        <li><Link to="/buy" className="nav-button">Buy</Link></li>
        <li><Link to="/rent" className="nav-button">Rent</Link></li>
      </ul>

      <div className="search-container">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search games, consoles..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </form>
      </div>

      <div className="navbar-actions">
        <div className="notifications">
          <Link to="/cart">
            <BsCart4 size={24} color="#ff4747" />
            {cartCount > 0 && <span className="notification-badge">{cartCount}</span>}
          </Link>
        </div>
        
        <div className="auth-buttons">
          {isAuthenticated ? (
            <button className="sign-in-btn" onClick={handleSignOutClick}>Sign Out</button>
          ) : (
            <>
              <button className="sign-in-btn" onClick={handleSignInClick}>Sign In</button>
              <button className="sign-in-btn" onClick={handleSignUpClick}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
