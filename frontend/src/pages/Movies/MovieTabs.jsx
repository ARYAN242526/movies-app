import { Link } from "react-router-dom";

const MovieTabs = ({
  userInfo,
  submitHandler,
  comment,
  setComment,
  rating,
  setRating,
  movie,
}) => {
    const reviews = movie?.data?.reviews || [];
  return (
    <div>
      {/* Review Form */}
      <section>
        {userInfo ? (
          <form onSubmit={submitHandler}>
            <div className="my-2">
              <label htmlFor="rating" className="block text-xl mb-2">
                Rating
              </label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="p-2 border rounded-lg xl:w-[40rem] text-black"
                required
              >
                <option value="">Select...</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>

            <div className="my-2">
              <label htmlFor="comment" className="block text-xl mb-2">
                Write Your Review
              </label>
              <textarea
                id="comment"
                rows="3"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="p-2 border rounded-lg xl:w-[40rem] text-black"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-teal-600 text-white py-2 px-4 rounded-lg"
            >
              Submit
            </button>
          </form>
        ) : (
          <p>
            Please{" "}
            <Link to="/login" className="text-teal-400 underline">
              Sign In
            </Link>{" "}
            to write a review
          </p>
        )}
      </section>

      {/* Reviews List */}
      <section className="mt-[3rem]">
        <div>
          {(!movie?.reviews || movie.reviews.length === 0) && (
            <p className="text-gray-400">No Reviews</p>
          )}
        </div>

        <div>
          {reviews?.map((review) => (
            <div
              key={review._id}
              className="bg-[#1A1A1A] p-4 rounded-lg w-[50%] mt-[2rem]"
            >
              <div className="flex justify-between items-center">
                <strong className="text-[#B0B0B0]">{review.name}</strong>
                <p className="text-[#B0B0B0] text-sm">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>

              <p className="text-yellow-400 my-2">⭐ {review.rating}/5</p>

              <p className="my-4 text-white">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieTabs;
