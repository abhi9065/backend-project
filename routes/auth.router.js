const express = require("express")
const router = express.Router()
const Movie = require("../models/movies")
const User = require("../models/users")
const generateToken = require("../utils/utils")
const authVerify = require("../middlewares/auth-verify.middleware")



async function signup(userDetail){
  const emailUser = userDetail.email
  const password = userDetail.password
  Console.log(password)

  const token = generateToken(emailUser)
  const userExists = await User.findOne({email : emailUser})

  
  if (userExists) {
    
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser ={
      email : userDetail.email,
      password : hashedPassword , 
      profilepictureUrl: userDetail.profilepictureUrl,
      username : userDetail.username,
      nickname : userDetail.nickname 
    }

    const user = new User(newUser)
    const savedUser = await user.save()
    console.log(savedUser)
    return(savedUser , token)

  }
};
   

router.post('/signup', authVerify , async (req, res) => {
  const newUserDetail = req.body

  try {
    const {savedUser , token} = await signup(newUserDetail)
    res.status(201).json({sucess : "new user created" , savedUser , token })
  } catch (error) {
    res.status(404).json({error : "not found"})
  }
});




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


router.post('/login', authVerify , async (req, res) => {
    const { username, password } = await login(req.body)
  
    const user = User.find((user) => user.username === username)
  
  
    try {
      const passwordMatch = await bcrypt.compare(password, user.password)
  
      if (passwordMatch) {
        res.json({ message: 'User Found'})
      } else {
        res.status(401).json({ message: 'Authentication failed 2' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Authentication failed 3' })
    }
  })


// router.post('/login', authVerify, async (req, res) => {

//   try {
//     const {userId} = req.user
//     const { email, password } = req.body;

//     if(userId === email){
//       const user = await login(email, password);
//       res.json(user);
//     }else{
//       res.json({error:"logged again"})
//     }

//   } catch (error) {
//     res.status(401).json({ error: 'Invalid credentials' });
//   }
// });


module.exports = router