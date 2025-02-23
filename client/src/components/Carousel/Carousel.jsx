import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Carousel.css';
import Shop1 from "../../assets/carousel/shop1.png";
import Shop2 from "../../assets/carousel/shop2.png";
import Shop3 from "../../assets/carousel/shop3.png";

const GameCarousel = () => {

  const renderArrow = (direction, onClickHandler) => (
    <button className={`control-${direction}`} onClick={onClickHandler}></button>
  );

  return (
    <div className="carousel-container">
      <Carousel 
        showThumbs={false} 
        autoPlay 
        infiniteLoop
        showStatus={false}
        renderArrowPrev={(onClickHandler, hasPrev) =>
          hasPrev && renderArrow('prev', onClickHandler)
        }
        renderArrowNext={(onClickHandler, hasNext) =>
          hasNext && renderArrow('next', onClickHandler)
        }
      >
        <div>
          <img src={Shop1} alt="Game 1" />
        </div>
        <div>
          <img src={Shop2} alt="Game 2" />
        </div>
        <div>
          <img src={Shop3} alt="Game 3" />
        </div>
      </Carousel>
    </div>
  );
};

export default GameCarousel;
