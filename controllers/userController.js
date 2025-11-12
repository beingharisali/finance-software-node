const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

// CREATE USER BY ROLE
const createUser = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password || !role) {
      throw new BadRequestError("Please provide fullname, email, password, and role");
    }

    // Who can create which roles
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

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, msg: "Email already registered" });
    }

    const user = await User.create({
      name: fullname,
      email,
      password,
      role,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message || "User creation failed",
    });
  }
};

// FETCH USERS BY ROLE OR ALL
const getUsers = async (req, res) => {
  try {
    const { role } = req.query; 
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, msg: "Not authorized" });
    }

    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, msg: err.message });
  }
};

module.exports = { createUser, getUsers };
