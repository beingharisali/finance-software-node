
// Admin aur Manager ke through users create/fetch karna
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

// CREATE USER
const createUser = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    if (!fullname || !email || !password || !role)
      throw new BadRequestError("Provide all required fields");

    const creatorRole = req.user.role;
    const allowedRolesByCreator = {
      admin: ["admin", "manager", "agent", "broker"],
      manager: ["agent", "broker"],
    };

    if (!allowedRolesByCreator[creatorRole]?.includes(role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: `You (${creatorRole}) cannot create a user with role ${role}`,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Email already registered" });

    const user = await User.create({
      fullname,
      email,
      password,
      role,
      createdBy: req.user.userId,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "User created successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

// GET USERS
const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let filter = {};

    // Manager sees only their own created users
    if (req.user.role === "manager") {
      filter.createdBy = req.user._id; 
    }

    // Filter by role if provided
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select("-password")
      .populate("createdBy", "fullname role") 
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message });
  }
};

module.exports = { createUser, getUsers };
