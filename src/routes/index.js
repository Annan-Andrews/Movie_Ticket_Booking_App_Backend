const express = require('express')
const { userRouter } = require('./userRoutes')
const { theaterOwnerAdminRouter } = require('./theaterOwnerAdminRoutes')

const router = express.Router()


router.use('/user', userRouter)
router.use('/theaterOwnerAdmin', theaterOwnerAdminRouter)


module.exports = {apiRouter: router}