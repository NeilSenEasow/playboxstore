import { Link } from 'react-router-dom';
import './Navbar.css';
import Logo from '../../assets/logo/logo-play.png';
import { useState } from 'react';
import { BsCart4 } from 'react-icons/bs';

const Navbar = ({ cartCount, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

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
          <Link to="/buy">Buy</Link>
        </li>
        <li>
          <Link to="/rent">Rent</Link>
        </li>
        <li>
          <Link to="/admin">Admin</Link>
        </li>
      </ul>
      <div className="navbar-actions">
        <div className="search-container">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </form>
        </div>
        <div className="notifications">
          <Link to="/cart">
            <BsCart4 size={24} color="#ff4747" />
            {cartCount > 0 && <span className="notification-badge">{cartCount}</span>}
          </Link>
        </div>
        <button className="sign-in-btn">Sign In</button>
        <button className="sign-in-btn">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
