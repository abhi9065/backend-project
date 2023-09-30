require("dotenv").config()

const ConnectDB = require("./db/db.connection")

const Movie = require("./models/movies")
const User = require("./models/users")

const movieJson = require("./movies.json")
const userJson = require("./Users.json")


const Start = async()=>{
  try {
    await ConnectDB(process.env.MONGODB_URL);
    await  Movie.deleteMany();

    await  Movie.create(movieJson);
    await User.deleteMany();

    await User.create(userJson)
    console.log("success")
  } catch (error) {
    console.log(error)
  }
}


Start()