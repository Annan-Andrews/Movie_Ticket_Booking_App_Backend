const express = require('express');
const { userSignup, userLogin, userProfile, userLogout } = require('../controllers/userControllers');
const userAuth = require('../middleware/userAuth');
const router = express.Router()




// signup
router.post('/signup', userSignup)

// login
router.put('/login', userLogin)

// profile
router.get('/profile',userAuth, userProfile)
 
// logout
router.get('/logout',userAuth, userLogout)

// profile-edit
// forgot-password
// change-password
// account-deactivate

// check-user


module.exports = { userRouter: router };
