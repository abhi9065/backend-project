const express = require("express")
const router = express.Router()
const Movie = require("../models/movies")
const User = require("../models/users")
const authVerify = require("../middlewares/auth-verify.middleware")



async function createMovie(movieData) {
  try {
    const movie = new Movie(movieData);
    const savedMovie = await movie.save();
    console.log("Created movie:", savedMovie);
    return savedMovie;
  } catch (error) {
    throw error;
  }
}

router.post('/movies', async (req, res) => {
  try {
    const savedMovie = await createMovie(req.body);
    res.status(201).json({ message: 'Movie added', movie: savedMovie });
  } catch (error) {
    console.log({ error })
    res.status(500).json({ error: 'Failed to add movie' });
  }
});


async function readMovie(movietitle){
try {
  const findTitle  = await Movie.findOne({title : movietitle})
  return(findTitle)
} catch (error) {
  console.log(error)
}

}

router.get("/movies/:title" , async (req,res) => {
  try {
    const movie = await readMovie(req.params.title)
    res.status(201).json({movies : movie})
  } catch (error) {
    res.status(404).json({error: "error not found"})
  }
})


async function readMovieByGenre(genreName){
  try {
    const genreFind = await Movie.find({genre : genreName})
    return genreFind
  } catch (error) {
    throw error
  }
}

router.get("/genre/:genreName" , async (req,res)=>{
  try {
    const genreName = await readMovieByGenre(req.params.genreName)
    res.status(201).json({genre : genreName})
  } catch (error) {
    res.status(404).json({error:'error'})
  }
})



async function readMoviesByDirectorname(directorName){
  try {
    const directorFind  = await Movie.findOne({director : directorName})
    console.log(directorFind)
    return directorFind
  } catch (error) {
    throw error
  }
}


router.get("/director/:directorName" , async (req,res)=>{
  try {
    const userId = req.params.directorName
    console.log(userId)
    const directorName = await readMoviesByDirectorname(req.params.directorName)
    
    res.status(201).json({movies : directorName})
  } catch (error) {
    res.status(404).json({error:'error'})
  }
})




async function updateMovie(movieId, updatedData) {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, updatedData, { new: true });
    return updatedMovie;
  } catch (error) {
    throw error;
  }
}

router.post('/update/:movieId', async (req, res) => {
  try {
    const updatedMovie = await updateMovie(req.params.movieId, req.body);
    if (updatedMovie) {
      res.json(updatedMovie);
    } else {
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update movie' });
  }
});


async function updateDataById(movieId){
  try {
    const updateMovie = await Movie.findByIdAndDelete(movieId)
    return updateMovie
  } catch (error) {
    throw error
  }
  }
  
  router.delete("/delete/:movieId" , async (req,res) => {
    try {
      const updateMovieData = await updateDataById(req.params.movieId)
      res.json(updateMovieData)
    } catch (error) {
      res.status(404).json({error:"error hai"})
    }
  
  })
  

  
async function addRatingAndReview(movieId,userId,reviewText ,rating){
 try {
  const movie = await Movie.findById(movieId)
   if(movie){

    // movie.reviews.ratings.push(rating)

    const review = {
      user : userId,
      text : reviewText,
      ratings : rating
    }
    movie.reviews.push(review)
    await movie.save()

   const movieWithReview = await Movie.findById(movieId).populate('reviews.user','username profilePictureUrl') 
    return(movieWithReview)
  }else{
    console.log("movie not found")
  }
} catch (error) {
  throw error
}
}

router.post('/movies/:movieId/rating', async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const { userId,  review ,rating } = req.body;

    const updatedMovie = await addRatingAndReview(movieId, userId, review  , rating);
    res.json(updatedMovie);
  } catch (error) {
    res.status(404).json({ error: 'Movie not found' });
  }
});



  async function getMovieReviewsWithUserDetails(movieId) {
    try {
      const movie = await Movie.findById(movieId).populate({
        path: 'reviews',
        populate: {
  
          path: 'user', select: 'username profilePictureUrl'
        },
      });
      const reviewsWithUserDetails = movie.reviews.slice(0, 3).map(review => ({
        reviewText: review.text,
        user: review.user,
      }));
      return reviewsWithUserDetails;
    } catch (error) {
      throw error;
    }
  }
  
  router.get('/movies/:movieId/reviews', async (req, res) => {
    try {
      const movieId = req.params.movieId;
      const reviewsWithUserDetails = await getMovieReviewsWithUserDetails(movieId);
      res.json(reviewsWithUserDetails);
    } catch (error) {
      res.status(404).json({ error: 'Movie not found' });
    }
  });

  module.exports = router