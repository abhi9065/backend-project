require("dotenv").config();

const mongoose = require('mongoose')

const connectDB = async(uri) => {
    await mongoose.connect(uri ,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{
        console.log("i am connected")
    })
}

module.exports   = connectDB