
const bcrypt = require('bcrypt');
const generateToken = require("../utils/token");
const TheaterOwnerAdmin = require('../models/theaterOwnerAdminModel');


const saltRounds = 10;

const theaterOwnerAdminSignup = async(req,res,next) =>{
  try{
    const {name, email, password, mobile, profilePic, role} = req.body;

    if (!name || !email || !password || !mobile || !role) {
      return res.status(400).json({message: "all fields are required"})
    }
    
    const isOwnerAdminExist = await TheaterOwnerAdmin.findOne({email});
    
    if (isOwnerAdminExist){ 
      return res.status(400).json({message: `${role === "admin" ? "Admin" : "Theater Owner"} already exists`});
    }

    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const OwnerAdminData = new TheaterOwnerAdmin({
      name,
      email,
      password: hashedPassword,
      mobile,
      profilePic,
      role
    });

    await OwnerAdminData.save();

    const token = generateToken(OwnerAdminData._id,OwnerAdminData.role)
    res.cookie("token", token);


    const OwnerAdminResponse = OwnerAdminData.toObject();
    delete OwnerAdminResponse.password;


    return res.json({
      data: OwnerAdminResponse,
      message: `${role === "admin" ? "Admin" : "Theater Owner"} account created successfully`,
    });

  } catch (error){
    console.error(error);
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});

  }
};

const theaterOwnerAdminLogin = async(req,res,next) =>{
  try{
    const {email, password, role} = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({message: "all fields are required"})
    }
    
    const OwnerAdminExist = await TheaterOwnerAdmin.findOne({email});

    if (!OwnerAdminExist){ 
      return res.status(404).json({message: `${role === "admin" ? "Admin" : "Theater Owner"} does not exist`});
    }

    const passwordMatch = bcrypt.compareSync(password, OwnerAdminExist.password);

    if(!passwordMatch){
      return res.status(401).json({message: "Wrong Password"})
    }

    const token = generateToken(OwnerAdminExist._id,OwnerAdminExist.role)
    res.cookie("token", token);


    const OwnerAdminResponse = OwnerAdminExist.toObject();
    delete OwnerAdminResponse.password;


    return res.json({
      data: OwnerAdminResponse, 
      message: `${role === "admin" ? "Admin" : "Theater Owner"} login successful` 
    });

  } catch (error){
    console.error(error);
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error"});

  }
};

const theaterOwnerAdminProfile = async (req, res, next) => {
  try {
      const OwnerAdminId = req.user.id;

      const OwnerAdminData = await TheaterOwnerAdmin.findById(OwnerAdminId);

      if (!OwnerAdminData) {
        return res.status(404).json({ message: "Theater Owner/Admin not found" });
      }

      const OwnerAdminResponse = OwnerAdminData.toObject();
      delete OwnerAdminResponse.password;

      return res.json({ 
        data: OwnerAdminResponse, 
        message: `${OwnerAdminResponse.role === "admin" ? "Admin" : "Theater Owner"} Profile Fetched`
      });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

const theaterOwnerAdminLogout = async (req, res, next) => {
  try {
    const OwnerAdminRole = req.user.role;
    
    res.clearCookie("token");

    return res.json({
      message: `${OwnerAdminRole === "admin" ? "Admin" : "Theater Owner"} Logut Success` 
    });
  } 
  catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
}


module.exports = {theaterOwnerAdminSignup, theaterOwnerAdminLogin, theaterOwnerAdminProfile, theaterOwnerAdminLogout}