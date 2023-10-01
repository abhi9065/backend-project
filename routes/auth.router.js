const express = require("express")
const bcrypt = require("bcrypt")
const router = express.Router()
const Movie = require("../models/movies")
const User = require("../models/users")
const generateToken = require("../utils/utils")
const authVerify = require("../middlewares/auth-verify.middleware")



async function signup(userDetail){
  const emailUser = userDetail.email
  const password = userDetail.password


  const token = generateToken(emailUser)
  const userExists = await User.findOne({email : emailUser})
  console.log(userExists)

  
  if (userExists) {
    console.log( "user already exists")
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
    return {savedUser , token}

  }
};
   
// signup({
//   "email": "jhihinhjain.com",
//   "password": "password1235",
//   "profilePictureUrl": "https://example.com/profile.jpg4",
//   "username": "exampleuser5",
//   "nickname": "Example Nick4"
// })

router.post('/signup',  async (req, res) => {
  const userDetail = req.body

  try {
    const {savedUser,token} = await signup(userDetail)
   
    res.status(201).json({success : "new user created" , savedUser,token})
  } catch (error) {
    res.status(404).json({error : "user already exist"})
  }
});


async function login(email,password){
  const user = await User.findOne({email:email})

  if(user){
    const comparePassword = await bcrypt.compare(password , user.password)
    if(comparePassword){
      return user
    }else{
      throw error
    }
  }
}

router.post('/login' , authVerify, async(req,res)=>{
  const userId = req.user
 const {email , password} = req.body
 if(userId === email){
 const user = await login(email,password)
 res.status(201).json({msg : "details" , userDetail:user})
 }else{
  res.status(404).json({msg : "user not found"})
 }
})



// async function login(email, password) {
//   const user = await User.findOne({ email : email });
//   if(user){
//   const comparePassword = await bcrypt.compare(password , user.password)

//   if(comparePassword){
//     return user
//   }else{
//     console.log("error")
//   }
//   } 
  
// }

// router.post('/login', async (req, res) => {
   
//   const {email,password} = req.body
    

//   try {
//     const user = await login(email,password)
//     res.status(201).json({msg:"detail" , user})
//   } catch (error) {
//     res.json({error:"error"})
//   }
    
  
// })


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