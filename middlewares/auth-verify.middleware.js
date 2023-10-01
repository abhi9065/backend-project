const jwt = require('jsonwebtoken')
const secret = "abhishekjain@gmail.com"


function verificationToken(token){
    try {
      const decoded = jwt.verify(token , secret)
      console.log(decoded)
      return decoded 
    } catch (error) {
      throw error
    }
  }
  
  
  function extractUserIdFromToken(decodedToken){
      if(decodedToken && decodedToken.userId){
          return decodedToken.userId
      }else{
        throw new Error('Invalid or missing user ID in token')
      }
  }
  
  
  function authVerify(req,res,next){
      const token = req.headers.authorization
  
     try {
      const decoded = verificationToken(token)
      const  userId = extractUserIdFromToken(decoded)
      
      req.user = userId
      console.log(userId)
      console.log(req.user)

      
       return next()
     } catch (error) {
      return res.status(401).json({ message: "Unauthorised access, please add the token"})
     }
  
  }
  

  module.exports = authVerify