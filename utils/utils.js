const jwt = require("jsonwebtoken")
const secret = 'abhishekjain@gmail.com'

const generateToken = (userId) =>{
  return jwt.sign({userId} , secret ,{expiresIn : '24hr'})
}

module.exports = generateToken