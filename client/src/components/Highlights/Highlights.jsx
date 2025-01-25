import './Highlights.css';
// import HighlightImage from '../../assets/highlights/highlights.png';
import HighlightImage from '../../assets/highlights/highlight-1.png';
import HighlightImage2 from '../../assets/highlights/highlight-2.png';
import HighlightImage3 from '../../assets/highlights/highlight-3.png';
import HighlightImage4 from '../../assets/highlights/highlight-4.png';

const Highlights = () => {
    return (
        <div className="highlights">
            <img src={HighlightImage} alt="Highlight" />
            <img src={HighlightImage2} alt="Highlight" />
            <img src={HighlightImage3} alt="Highlight" />
            <img src={HighlightImage4} alt="Highlight" />
        </div>
    );
};

export default Highlights;