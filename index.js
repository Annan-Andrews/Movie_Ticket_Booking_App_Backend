const express = require('express')
const connectDB = require('./src/config/db')
const { apiRouter } = require('./src/routes')
var cookieParser = require('cookie-parser')


connectDB()

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cookieParser())


app.use((req, res, next)=>{
  console.log("Working")
  next()
})


app.use('/api',apiRouter)



app.listen(port, ()=>{
  console.log(`Server Started on port ${port}`)
})