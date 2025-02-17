const express = require('express');
const { userSignup, userLogin, userProfile, userLogout, checkUser, editUserProfile, changePassword, deactivateAccount } = require('../controllers/userControllers');
const userAuth = require('../middleware/userAuth');
const { upload } = require('../middleware/multer');
const router = express.Router()




// signup
router.post('/signup', userSignup)

// login
router.post('/login', userLogin)

// profile
router.get('/profile',userAuth, userProfile)
 
// logout
router.get('/logout',userAuth, userLogout)

// profile-edit
router.post('/profile-edit', userAuth, upload, editUserProfile);

// change-password
router.post('/change-password', userAuth, changePassword);

// account-deactivate
router.patch('/account-deactivate', userAuth, deactivateAccount);

// check-user
router.get("/check-user", userAuth, checkUser);



// forgot-password


module.exports = { userRouter: router };
