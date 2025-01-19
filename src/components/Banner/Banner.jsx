import './Banner.css';
import BannerImage from '../../assets/banner/banner-sell.png';

const Banner = () => {
    return (
        <div className="banner">
            <img src={BannerImage} alt="Banner" />
        </div>
    );
};

export default Banner;