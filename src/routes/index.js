const express = require('express')
const { userRouter } = require('./userRoutes')
const { theaterOwnerAdminRouter } = require('./theaterOwnerAdminRoutes')
const { movieRouter } = require('./moviesRoutes')
const { theaterRouter } = require('./theaterRoutes')
const { reviewRouter } = require('./reviwRoutes')
const { bookingRouter } = require('./bookingRoutes')
const { paymentRouter } = require('./paymentRoutes')

const router = express.Router()


router.use('/user', userRouter)
router.use('/theaterOwnerAdmin', theaterOwnerAdminRouter)
router.use('/movies', movieRouter)
router.use('/theater', theaterRouter)
router.use('/review', reviewRouter)
router.use('/booking', bookingRouter)
router.use('/payment', paymentRouter)


module.exports = {apiRouter: router}