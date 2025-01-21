const express = require('express');
const {theaterOwnerAdminSignup, theaterOwnerAdminLogin, theaterOwnerAdminProfile, theaterOwnerAdminLogout} = require('../controllers/theaterOwnerAdminControllers');
const theaterOwnerAdminAuth = require('../middleware/theaterOwnerAdminAuth');
const router = express.Router()




// signup
router.post('/signup', theaterOwnerAdminSignup)

// login
router.put('/login', theaterOwnerAdminLogin)

// profile
router.get('/profile', theaterOwnerAdminAuth, theaterOwnerAdminProfile )

// logout
router.get('/logout', theaterOwnerAdminAuth, theaterOwnerAdminLogout)

// profile-edit
// forgot-password
// change-password
// account-deactivate

// check-user


module.exports = { theaterOwnerAdminRouter: router };
