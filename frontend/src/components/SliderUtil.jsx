import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MovieCard from '../pages/Movies/MovieCard';


const SliderUtil = ({data}) => {
    const settings = {
        dots : true,
        infinite : true,
        speed : 500,
        slidesToShow : 4 , 
        slidesToScroll : 2
    };

    const movies = Array.isArray(data) ? data : [];

    console.log("SliderUtil Movies : " , movies);
    
  return(
    <Slider {...settings}>
        {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
        ))}
    </Slider>
  ); 
}

export default SliderUtil