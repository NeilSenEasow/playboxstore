import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import GameCarousel from './components/Carousel/Carousel';
import ProductSection from './components/ProductSection/ProductSection';
import GamesSection from './components/GameSection/GameSection';
import Banner from './components/Banner/Banner';
import Highlights from './components/Highlights/Highlights';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Hero />
        <GameCarousel />
        <ProductSection />
        <GamesSection />
        <Banner />
        <Highlights />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
