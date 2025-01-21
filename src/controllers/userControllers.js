const UserModel = require("../models/usermodel");
const bcrypt = require('bcrypt');
const generateToken = require("../utils/token");


const saltRounds = 10;

const userSignup = async(req,res,next) =>{
  try{
    const {name, email, password, mobile, profilePic} = req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({message: "all fields are required"})
    }
    
    const isUserExist = await UserModel.findOne({email});
    
    if (isUserExist){ 
      return res.status(400).json({message: "User Already Exists"});
    }

    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const userData = new UserModel({name,email, password: hashedPassword,mobile,profilePic});
    await userData.save();

    const token = generateToken(userData._id)
    res.cookie("token", token);


    const userResponse = userData.toObject();
    delete userResponse.password;


    return res.json({data: userResponse, message: "User account Created"});

  } catch (error){

    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});

  }
};


const userLogin = async(req,res,next) =>{
  try{
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({message: "all fields are required"})
    }
    
    const UserExist = await UserModel.findOne({email});

    if (!UserExist){ 
      return res.status(404).json({message: "User Does not Exist"});
    }

    const passwordMatch = bcrypt.compareSync(password, UserExist.password);

    if(!passwordMatch){
      return res.status(401).json({message: "Wrong Password"})
    }

    const token = generateToken(UserExist._id)
    res.cookie("token", token);


    const userResponse = UserExist.toObject();
    delete userResponse.password;


    return res.json({data: userResponse, message: "User Login Success"});

  } catch (error){

    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});

  }
};

const userProfile = async (req, res, next) => {
  try {
      const userId = req.user.id;

      
      const userData = await UserModel.findById(userId);

      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }

      const userResponse = userData.toObject();
      delete userResponse.password;

      return res.json({ data: userResponse, message: "User Profile Fetched" });
  } catch (error) {
      return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

const userLogout = async (req, res, next) => {
  try {
      res.clearCookie("token");

      return res.json({ message: "User Logout success" });
  } catch (error) {
      return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
}

module.exports = {userSignup, userLogin, userProfile, userLogout}