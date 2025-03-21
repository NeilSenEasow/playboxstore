import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import GameCarousel from './components/Carousel/Carousel';
import ProductSection from './components/ProductSection/ProductSection';
import GamesSection from './components/GameSection/GameSection';
import Banner from './components/Banner/Banner';
import Highlights from './components/Highlights/Highlights';
import Footer from './components/Footer/Footer';
import Cart from './components/Cart/Cart';
import Buy from './components/Buy/Buy';
import Sell from './components/Sell/Sell';
import SellForm from './components/Sell/SellForm';
import Rent from './components/Rent/Rent';
import Checkout from './components/Checkout/Checkout';
import SearchResults from './components/SearchResults/SearchResults';
import RentDetails from './components/RentDetails/RentDetails';
import Payment from './components/Payment/Payment';
import Admin from './components/Admin/Admin';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import PrivateRoute from './components/PrivateRoute';
import UserProfile from './components/UserProfile/UserProfile';
import './App.css';
import ErrorBoundary from './ErrorBoundary';
import GPay from './components/GPay/GPay';
import SuccessPage from './components/SuccessPage/SuccessPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [searchResults, setSearchResults] = useState([]);
  const [backendData, setBackendData] = useState(null);
  const [userPreferences, setUserPreferences] = useState(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : {
      recentSearches: [],
      viewedItems: [],
      lastVisit: new Date().toISOString()
    };
  });

  const [storeData, setStoreData] = useState({
    featured: [],
    products: [],
    games: [],
    rentItems: [],
    sellItems: []
  });

  // Check for token in local storage on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // User is authenticated if token exists
    }
  }, []);

  // Fetch data from backend
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_PROD_BASE_URL + '/api/products' || VITE_API_URL + '/products'; // Use local API URL
    console.log(apiUrl);
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setStoreData(prev => ({ ...prev, products: data })); // Update only products
        } else {
          console.error("Fetched data is not an array:", data);
          setStoreData(prev => ({ ...prev, products: [] })); // Set to empty array if not valid
        }
        setBackendData(data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setStoreData(prev => ({ ...prev, products: [] })); // Set to empty array on error
      });
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save user preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Update allProducts to use backend data
  const allProducts = useMemo(() => {
    const { featured = [], products = [], games = [], rentItems = [], sellItems = [] } = storeData;
    return [...featured, ...products, ...games, ...rentItems, ...sellItems];
  }, [storeData]);

  const updateCartCount = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        // If the item already exists, update its quantity
        return prevItems.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } // Increment quantity
            : cartItem
        );
      } else {
        // If it doesn't exist, add it to the cart with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    
    setUserPreferences(prev => ({
      ...prev,
      viewedItems: [...new Set([...prev.viewedItems, item.id])].slice(-10)
    }));
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = allProducts.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);

    setUserPreferences(prev => ({
      ...prev,
      recentSearches: [...new Set([query, ...prev.recentSearches])].slice(0, 5)
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setCartItems([]);//Clear the cart items
    setIsAuthenticated(false); // Update authentication state
  };

  const handleLogin = (token) => {
    localStorage.setItem('token', token); // Store token in local storage
    setIsAuthenticated(true); // Set isAuthenticated to true upon successful login
  };

  const SignOutButton = () => (
    <button onClick={handleSignOut} className="sign-out-button">
      Sign Out
    </button>
  );

  return (
    <ErrorBoundary>
      <Router>
        <div>
          <Navbar 
            cartCount={cartItems.length} 
            onSearch={handleSearch}
            recentSearches={userPreferences.recentSearches}
            isAuthenticated={isAuthenticated}
            onSignOut={handleSignOut}
          />
          <SearchResults results={searchResults} updateCartCount={updateCartCount} />
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <GameCarousel items={storeData.featured} />
                <ProductSection 
                  products={storeData.products} 
                  updateCartCount={updateCartCount} 
                />
                <GamesSection 
                  games={storeData.games} 
                  updateCartCount={updateCartCount} 
                />
                <Banner />
                <Highlights />
              </>
            } />
            <Route 
              path="/sell" 
              element={
                <Sell 
                  items={storeData.sellItems} 
                  updateCartCount={updateCartCount} 
                />
              } 
            />
            <Route 
              path="/sell-form" 
              element={<SellForm />}
            />
            <Route 
              path="/buy" 
              element={
                <Buy 
                  items={storeData.products} 
                  updateCartCount={updateCartCount} 
                />
              } 
            />
            <Route 
              path="/rent" 
              element={
                <Rent 
                  items={storeData.rentItems} 
                  updateCartCount={updateCartCount} 
                />
              } 
            />
            <Route path="/rent/:id" element={<RentDetails updateCartCount={updateCartCount} />} />
            <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} removeFromCart={removeFromCart} clearCart={clearCart} />} />
            <Route path="/checkout" element={<Checkout cartItems={cartItems} clearCart={clearCart} userPreferences={userPreferences} />} />
            <Route path="/payment" element={<Payment cartItems={cartItems} clearCart={clearCart} />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Admin isAuthenticated={isAuthenticated} />
                </PrivateRoute>
              } 
            />
            <Route path="/signin" element={<SignIn onSignIn={handleLogin} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <UserProfile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/gpay" 
              element={
                <GPay 
                  amount={cartItems.reduce((total, item) => total + item.price, 0)}
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
//testing commit