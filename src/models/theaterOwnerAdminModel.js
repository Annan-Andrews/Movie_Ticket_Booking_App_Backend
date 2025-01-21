const mongoose = require('mongoose');

const TheaterOwnerAdminSchema = new mongoose.Schema({
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
    required: true
  },
  mobile: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: 'https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png', 
  },
  role: {
    type: String,
    enum: ['theaterOwner', 'admin'], 
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // theaters: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Theater',
  // }]
});

const TheaterOwnerAdmin = mongoose.model('TheaterOwnerAdmin', TheaterOwnerAdminSchema);

module.exports = TheaterOwnerAdmin;
