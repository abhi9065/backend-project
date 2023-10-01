const express = require("express")
const router = express.Router()
const Movie = require("../models/movies")
const User = require("../models/users")
const generateToken = require("../utils/utils")
const authVerify = require("../middlewares/auth-verify.middleware")



async function signup(userDetail){
    try {
        const user =  new User(userDetail)
        const newUser = await user.save()
        return newUser 
    } catch (error) {
        throw error
    }
 
}

router.post('/signup', authVerify , async (req, res) => {
  const { username, password } = await signup(req.body);


  const userExists = User.some(user => user.username === username);

  if (userExists) {
    res.status(400).json({ message: 'Username already taken' });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    User.push({ username, password: hashedPassword });
    const token = generateToken();
    User.push({ username, password });
    console.log({ User })
    res.status(201).json({ message: 'Registration successful', token });
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