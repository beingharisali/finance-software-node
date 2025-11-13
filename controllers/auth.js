const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// REGISTER
const register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password) {
      throw new BadRequestError("Please provide fullname, email, and password");
    }

    const allowedRoles = ["admin", "manager", "agent", "broker"];

    if (role && !allowedRoles.includes(role)) {
      throw new BadRequestError("Invalid role provided");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Email already registered" });
    }

    // create new user
    const user = await User.create({
       fullname,
      email,
      password,
      role,
    });

    // create token
    const token = user.createJWT();
    res
    .status(StatusCodes.CREATED)
    .json({ 
      success: true,
      msg: "User registered successfully",
      user: {id: user._id, fullname: user.fullname, email: user.email, role: user.role }, token

    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message || "Registration failed",
    });
  }
};

//  LOGIN
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    // role check
    if (role && user.role !== role) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: `Selected role does not match user's role (${user.role})`,
      });
    }

    const token = user.createJWT();
    res
    .status(StatusCodes.OK)
    .json({ 
        success: true,
      msg: "User logged in successfully",
    user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role }, token });

  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message || "Login failed",
    });
  }
};

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthenticatedError("Authentication invalid");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message || "Error fetching profile",
    });
  }
};

module.exports = { register, login, getProfile };
