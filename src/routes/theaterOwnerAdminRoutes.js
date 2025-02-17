const express = require('express');
const {theaterOwnerAdminSignup, theaterOwnerAdminLogin, theaterOwnerAdminProfile, theaterOwnerAdminLogout, editTheaterOwnerAdminProfile, checkOwnerAdmin, changeTheaterOwnerAdminPassword, deactivateTheaterOwnerAdminAccount} = require('../controllers/theaterOwnerAdminControllers');
const theaterOwnerAdminAuth = require('../middleware/theaterOwnerAdminAuth');
const router = express.Router()




// signup
router.post('/signup', theaterOwnerAdminSignup)

// login
router.post('/login', theaterOwnerAdminLogin)

// profile
router.get('/profile', theaterOwnerAdminAuth, theaterOwnerAdminProfile )

// logout
router.get('/logout', theaterOwnerAdminAuth, theaterOwnerAdminLogout)

// profile-edit
router.put('/profile-edit', theaterOwnerAdminAuth, editTheaterOwnerAdminProfile);

// change-password
router.put('/change-password', theaterOwnerAdminAuth, changeTheaterOwnerAdminPassword);

// account-deactivate
router.patch('/account-deactivate', theaterOwnerAdminAuth, deactivateTheaterOwnerAdminAccount);

// check-user
router.get("/check-user", theaterOwnerAdminAuth, checkOwnerAdmin);


// forgot-password

module.exports = { theaterOwnerAdminRouter: router };
