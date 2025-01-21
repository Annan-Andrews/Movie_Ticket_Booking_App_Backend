const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  mobile: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: 'https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png', 
  },
  isActive: {
    type: Boolean,
    default: true,
  },
})


const UserModel = mongoose.model('user', UserSchema)


module.exports= UserModel