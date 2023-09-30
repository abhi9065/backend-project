require("dotenv").config();

const mongoose = require('mongoose')
const Movie = require("../models/movies")
const movie_json = require("../movies.json")

const connectDB = async(uri) => {
    await mongoose.connect(uri ,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{
        console.log("i am connected")
    })
}

module.exports   = connectDB