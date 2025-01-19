import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './ProductSection.css';

import Image1 from '../../assets/console/console1.png';
import Console2 from '../../assets/console/console2.png';
import Image3 from '../../assets/console/console3.png';
import Image4 from '../../assets/console/console4.png';

const products = [
  {
    name: 'Official Sony DualShock',
    price: '₹3,299.00',
    image: Image1,
  },
  {
    name: 'Sony PlayStation 2',
    price: '₹3,899.00',
    image: Console2,
  },
  {
    name: 'Xbox Series X',
    price: '₹30,000.00',
    image: Image3,
  },
  {
    name: 'PlayStation 3 Slim 120',
    price: '₹24,999.00',
    image: Image4,
  },
];

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 4 },
  desktop: { breakpoint: { max: 1024, min: 768 }, items: 3 },
  tablet: { breakpoint: { max: 768, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const ProductSection = () => {
  return (
    <div className="product-section">
      <h2 className="section-title">
        Explore Our <span className="highlight">Consoles</span>
      </h2>
      <Carousel responsive={responsive} infinite={true} autoPlay={true} autoPlaySpeed={3000}>
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">
              {product.name.split(' ')[0]} <span className="highlight">{product.name.split(' ').slice(1).join(' ')}</span>
            </h3>
            <p className="product-price">
              <span className="highlight">{product.price}</span>
            </p>
            <div className="product-buttons">
              <button className="btn-primary">View More</button>
              <button className="btn-secondary">Add To Cart</button>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductSection;
