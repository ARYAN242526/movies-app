import { useState } from "react";
import { useParams , Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    useGetSpecificMovieQuery,
    useAddMovieReviewMutation
} from '../../redux/api/movies';
import MovieTabs from "./MovieTabs";


const MovieDetails = () => {
    const {id : movieId} = useParams();
    const [rating ,setRating] = useState(0);
    const [comment , setComment] = useState("");
    const {data : movie ,error, isLoading ,  refetch} = useGetSpecificMovieQuery(movieId);
    console.log(movie);
    
    const {userInfo} = useSelector((state) => state.auth);
    const [createReview , {isLoading : loadingMovieReview}] = useAddMovieReviewMutation();

    const submitHandler = async(e) => {
        e.preventDefault();

        try {
            await createReview({
                id : movieId,
                rating,
                comment
            }).unwrap();

            refetch()

            toast.success('Review created successfully');
            setRating(0);
            setComment("");
        } catch (error) {
            toast.error(error.data || error.message)
        }
    }
    if(isLoading){
         return <p className="text-white text-center mt-10">Loading movie details...</p>;
    }

    if(error){
         return <p className="text-red-500 text-center mt-10">Failed to load movie details</p>;
    }

  return (
    <>
    <div>
        <Link
        to= '/' 
        className="  text-white font-semibold hover:underline ml-[20rem]"
        >Go Back
        </Link>
    </div>

    <div className="mt-[2rem]">
        <div className="flex justify-center items-center">
            <img
            src={movie?.data?.image}
            alt= {movie?.data?.name}
            className="w-[70%] rounded"
            />
        </div>
        {/* Movie details */}
        <div className="container  flex justify-between ml-[20rem] mt-[3rem]">
            <section>
                <h2 className="text-5xl my-4 font-extrabold">{movie?.name}</h2>
                <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">
                    {movie?.data?.detail}
                </p>
            </section>

            <div className="mr-[5rem]">
                <p className="text-2xl font-semibold">
                    Releasing Date : {movie?.data?.year}
                    </p>

                <div>
                    {movie?.data.cast?.map((c , idx) => (
                        <ul key={idx}>
                            <li className="mt-[1rem]">{c}</li>
                        </ul>
                    ))}
                </div>
            </div>
        </div>

        <div className="container ml-[20rem]">
            <MovieTabs
              loadingMovieReview = {loadingMovieReview}
              userInfo = {userInfo}
              submitHandler = {submitHandler} 
              rating = {rating} 
              setRating = {setRating} 
              comment = {comment} 
              setComment = {setComment}
              movie = {movie}
            />
        </div>
    </div>
    </>
  )
}

export default MovieDetails