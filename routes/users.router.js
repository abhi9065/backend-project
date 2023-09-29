const express = require("express")
const router = express.Router()
const Movie = require("../models/movies")
const User = require("../models/users")


async function changePassword(email, currentPassword, newPassword) {
    try {
      const user = await User.findOne({ email });
      if (user && user.password === currentPassword) {
        user.password = newPassword;
        const updatedUser = await user.save();
        return updatedUser;
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      throw error;
    }
  }
  
  router.post('/change-password', async (req, res) => {
    try {
      const { email, currentPassword, newPassword } = req.body;
      const updatedUser = await changePassword(email, currentPassword, newPassword);
      res.json(updatedUser);
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
  
  async function updateProfilePicture(email, newProfilePictureUrl) {
    try {
      const user = await User.findOne({ email });
      if (user) {
        user.profilePictureUrl = newProfilePictureUrl;
        const updatedUser = await user.save();
        return updatedUser;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      throw error;
    }
  }
  
  
router.post('/update-profile-picture', async (req, res) => {
    try {
      const { email, newProfilePictureUrl } = req.body;
      const updatedUser = await updateProfilePicture(email, newProfilePictureUrl);
      res.json(updatedUser);
    } catch (error) {
      res.status(404).json({ error: 'User not found' });
    }
  });
  
  async function updateContactDetails(email, updatedContactDetails) {
    try {
      const user = await User.findOne({ email });
      if (user) {
        Object.assign(user, updatedContactDetails);
        const updatedUser = await user.save();
        return updatedUser;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      throw error;
    }
  }
  
  router.post('/update-contact/:email', async (req, res) => {
    try {
      const email = req.params.email;
      console.log({ email })
      const updatedContactDetails = req.body;
      const updatedUser = await updateContactDetails(email, updatedContactDetails);
      res.json(updatedUser);
    } catch (error) {
      res.status(404).json({ error: 'User not found' });
    }
  });
  
  async function findUserByPhoneNumber(phoneNumber) {
    try {
      const userByPhoneNumber = await User.findOne({ phoneNumber });
      if (userByPhoneNumber) {
        return userByPhoneNumber;
      } else {
        throw new Error("User not found")
      }
    } catch (error) {
      throw error;
    }
  }
  
 router.get('/users/phone/:phoneNumber', async (req, res) => {
    try {
      const phoneNumber = req.params.phoneNumber;
      const user = await findUserByPhoneNumber(Number(phoneNumber));
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });


  module.exports = router