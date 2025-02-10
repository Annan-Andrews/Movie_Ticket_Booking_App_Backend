const UserModel = require("../models/usermodel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/token");

const NODE_ENV = process.env.NODE_ENV;

const saltRounds = 10;

const userSignup = async (req, res, next) => {
  try {
    const { name, email, password, mobile, profilePic } = req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const isUserExist = await UserModel.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const userData = new UserModel({
      name,
      email,
      password: hashedPassword,
      mobile,
      profilePic,
    });
    await userData.save();

    const token = generateToken(userData._id);
    // res.cookie("token", token);
    res.cookie("token", token, {
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: NODE_ENV === "production",
    });

    const userResponse = userData.toObject();
    delete userResponse.password;

    return res.json({ data: userResponse, message: "User account Created" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const UserExist = await UserModel.findOne({ email });

    if (!UserExist) {
      return res.status(404).json({ message: "User Does not Exist" });
    }

    const passwordMatch = bcrypt.compareSync(password, UserExist.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    const token = generateToken(UserExist._id);
    // res.cookie("token", token);
    res.cookie("token", token, {
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: NODE_ENV === "production",
    });

    const userResponse = UserExist.toObject();
    delete userResponse.password;

    return res.json({ data: userResponse, message: "User Login Success" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
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
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const userLogout = async (req, res, next) => {
  try {
    // res.clearCookie("token");
    res.clearCookie("token", {
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: NODE_ENV === "production",
    });

    return res.json({ message: "User Logout success" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const editUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, mobile, profilePic } = req.body;

    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (mobile) updatedData.mobile = mobile;
    if (profilePic) updatedData.profilePic = profilePic;

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new passwords are required" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const deactivateAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Account deactivated successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const checkUser = async (req, res, next) => {
  try {
    return res.json({ message: "user autherized" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  userSignup,
  userLogin,
  userProfile,
  userLogout,
  editUserProfile,
  changePassword,
  deactivateAccount,
  checkUser,
};
