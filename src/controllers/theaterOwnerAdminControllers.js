const bcrypt = require("bcrypt");
const generateToken = require("../utils/token");
const TheaterOwnerAdmin = require("../models/theaterOwnerAdminModel");

const NODE_ENV = process.env.NODE_ENV;

const saltRounds = 10;

const theaterOwnerAdminSignup = async (req, res, next) => {
  try {
    const { name, email, password, mobile, profilePic, role } = req.body;

    if (!name || !email || !password || !mobile || !role) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const isOwnerAdminExist = await TheaterOwnerAdmin.findOne({ email });

    if (isOwnerAdminExist) {
      return res
        .status(400)
        .json({
          message: `${
            role === "admin" ? "Admin" : "Theater Owner"
          } already exists`,
        });
    }

    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const OwnerAdminData = new TheaterOwnerAdmin({
      name,
      email,
      password: hashedPassword,
      mobile,
      profilePic,
      role,
    });

    await OwnerAdminData.save();

    const token = generateToken(OwnerAdminData._id, OwnerAdminData.role);
    // res.cookie("token", token);
    res.cookie("token", token, {
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: NODE_ENV === "production",
    });

    const OwnerAdminResponse = OwnerAdminData.toObject();
    delete OwnerAdminResponse.password;

    return res.json({
      data: OwnerAdminResponse,
      message: `${
        role === "admin" ? "Admin" : "Theater Owner"
      } account created successfully`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const theaterOwnerAdminLogin = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const OwnerAdminExist = await TheaterOwnerAdmin.findOne({ email });

    if (!OwnerAdminExist) {
      return res
        .status(404)
        .json({
          message: `${
            role === "admin" ? "Admin" : "Theater Owner"
          } does not exist`,
        });
    }

    const passwordMatch = bcrypt.compareSync(
      password,
      OwnerAdminExist.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    const token = generateToken(OwnerAdminExist._id, OwnerAdminExist.role);
    // res.cookie("token", token);
    res.cookie("token", token, {
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: NODE_ENV === "production",
    });

    const OwnerAdminResponse = OwnerAdminExist.toObject();
    delete OwnerAdminResponse.password;

    return res.json({
      data: OwnerAdminResponse,
      message: `${
        role === "admin" ? "Admin" : "Theater Owner"
      } login successful`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
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
      message: `${
        OwnerAdminResponse.role === "admin" ? "Admin" : "Theater Owner"
      } Profile Fetched`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const theaterOwnerAdminLogout = async (req, res, next) => {
  try {
    const OwnerAdminRole = req.user.role;

    // res.clearCookie("token");
    res.clearCookie("token", {
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: NODE_ENV === "production",
    });

    return res.json({
      message: `${
        OwnerAdminRole === "admin" ? "Admin" : "Theater Owner"
      } Logut Success`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const editTheaterOwnerAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id; // Assuming `theaterOwnerAdminAuth` adds `req.user`
    const { name, email, mobile, profilePic } = req.body;

    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (mobile) updatedData.mobile = mobile;
    if (profilePic) updatedData.profilePic = profilePic;

    const updatedAdmin = await TheaterOwnerAdmin.findByIdAndUpdate(
      adminId,
      updatedData,
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Theater Owner/Admin not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", data: updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const changeTheaterOwnerAdminPassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new passwords are required" });
    }

    const admin = await TheaterOwnerAdmin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Theater Owner/Admin not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;

    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const deactivateTheaterOwnerAdminAccount = async (req, res) => {
  try {
    const adminId = req.user.id;

    const admin = await TheaterOwnerAdmin.findByIdAndUpdate(
      adminId,
      { isActive: false },
      { new: true }
    );
    if (!admin) {
      return res.status(404).json({ message: "Theater Owner/Admin not found" });
    }

    res
      .status(200)
      .json({ message: "Account deactivated successfully", data: admin });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const checkOwnerAdmin = async (req, res, next) => {
  try {
    const OwnerAdminRole = req.user.role;

    return res.json({
      message: `${
        OwnerAdminRole === "admin" ? "Admin" : "Theater Owner"
      } autherized`,
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  theaterOwnerAdminSignup,
  theaterOwnerAdminLogin,
  theaterOwnerAdminProfile,
  theaterOwnerAdminLogout,
  editTheaterOwnerAdminProfile,
  changeTheaterOwnerAdminPassword,
  deactivateTheaterOwnerAdminAccount,
  checkOwnerAdmin,
};
