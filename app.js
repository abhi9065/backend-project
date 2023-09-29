require("dotenv").config();

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

const connectDB = require("./db/db.connection")


const movies = require("./routes/movies.router")
const users = require("./routes/users.router")
const auth = require("./routes/users.router")

const errorHandler = require("./middlewares/error-handler.middleware")
const rountNotFound = require("./middlewares/route-not-found.middleware")
const authVerify = require("./middlewares/auth-verify.middleware")

app.use(express.json())

connectDB(process.env.MONGODB_URL)

app.get('/', (req, res) => {
    res.send('Hello, Express!');
  });
  

  app.use("/auth" , auth)
  app.use("/movies" , movies)
  app.use("/user-details" , authVerify ,users)

  app.use( rountNotFound)
  app.use( errorHandler)

  


  const Start = async() =>{
    try {
       await connectDB(process.env.MONGODB_URL)
       console.log(` i am connected to data`)
       app.listen(PORT, ()=>{
        console.log(`${PORT} i am connected`)
       }) 
    } catch (error) {
       console.log(error) 
    }
  }
  
  Start()