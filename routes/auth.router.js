const express = require("express")
const router = express.Router()
const Movie = require("../models/movies")
const User = require("../models/users")
const generateToken = require("../utils/utils")
const authVerify = require("../middlewares/auth-verify.middleware")

async function signup(userDetail){
    try {
        const user = await new User(userDetail)
        const newUser = user.save()
        return newUser 
    } catch (error) {
        throw error
    }
 
}


router.post("/signup" , async (req,res)=>{
    try {
        const savedUser = await signup(req.body) 
        const token = generateToken(savedUser._id)
        res.json({user : savedUser , token , success: true , message:"sign up successfull"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"failed to create user account"})
    }
})


async function login(email, password) {
  try {
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      console.log("Logged in user:", user);
      return user;
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    throw error;
  }
}


router.post('/login', authVerify, async (req, res) => {

  try {
    const {userId} = req.user
    const { email, password } = req.body;

    if(userId === email){
      const user = await login(email, password);
      res.json(user);
    }else{
      res.json({error:"logged again"})
    }

  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});


module.exports = router