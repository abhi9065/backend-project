const jwt = require("jsonwebtoken")
const secret = process.env('abhi@bhi1')

const generateToken = (userId) =>{
  return jwt.sign({userId} , secret ,{expiresIn : '24hr'})
}

module.exports = generateToken