const express = require('express');
const {theaterOwnerAdminSignup, theaterOwnerAdminLogin, theaterOwnerAdminProfile, theaterOwnerAdminLogout, editTheaterOwnerAdminProfile, checkOwnerAdmin, changeTheaterOwnerAdminPassword, deactivateTheaterOwnerAdminAccount, getTheaterOwner} = require('../controllers/theaterOwnerAdminControllers');
const theaterOwnerAdminAuth = require('../middleware/theaterOwnerAdminAuth');
const { upload } = require('../middleware/multer');
const router = express.Router()




// signup
router.post('/signup', theaterOwnerAdminSignup)

// login
router.post('/login', theaterOwnerAdminLogin)

// profile
router.get('/profile', theaterOwnerAdminAuth, theaterOwnerAdminProfile )

// get All theater owners
router.get('/get-all-theaterOwners', theaterOwnerAdminAuth, getTheaterOwner )

// logout
router.get('/logout', theaterOwnerAdminAuth, theaterOwnerAdminLogout)

// profile-edit
router.post('/profile-edit', theaterOwnerAdminAuth, upload, editTheaterOwnerAdminProfile);

// change-password
router.post('/change-password', theaterOwnerAdminAuth, changeTheaterOwnerAdminPassword);

// account-deactivate
router.patch('/account-deactivate', theaterOwnerAdminAuth, deactivateTheaterOwnerAdminAccount);

// check-user
router.get("/check-user", theaterOwnerAdminAuth, checkOwnerAdmin);


// forgot-password

module.exports = { theaterOwnerAdminRouter: router };
