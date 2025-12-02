
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

// ---------------------------
// CREATE USER
// ---------------------------
const createUser = async (req, res) => {
  try {
    const { fullname, email, password, role, phone } = req.body;
    if (!fullname || !email || !password || !role) {
      throw new BadRequestError("Provide all required fields");
    }

    const creatorRole = req.user.role;

    // Updated: assistant can create broker
    const allowedRolesByCreator = {
      admin: ["admin", "manager", "broker", "assistant"],
      manager: ["broker", "assistant"],
      assistant: ["broker"],
    };

    if (!allowedRolesByCreator[creatorRole]?.includes(role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: `You (${creatorRole}) cannot create a user with role "${role}"`,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Email already registered" });
    }

    const user = await User.create({
      fullname,
      email,
      password,
      role,
      phone,
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
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message,
    });
  }
};

// ---------------------------
// GET USERS
// ---------------------------
const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let filter = {};
    const userRole = req.user.role;

    if (userRole === "manager") {
      filter.role = { $in: ["broker", "assistant"] };
      if (role && !["broker", "assistant", "all"].includes(role)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          msg: "Managers can only view brokers & assistants.",
        });
      }
      if (role && role !== "all") filter.role = role;
    } else if (userRole === "assistant") {
      filter.role = "broker"; // Assistant can only see brokers
    } else if (role && role !== "all") {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select("-password")
      .populate("createdBy", "fullname role")
      .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message,
    });
  }
};

// ---------------------------
// UPDATE USER
// ---------------------------
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, role, phone } = req.body;

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) throw new NotFoundError("User not found");

    if (role && req.user.role !== "admin") {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "Only admin can change roles",
      });
    }

    if (fullname) userToUpdate.fullname = fullname;
    if (email) userToUpdate.email = email;
    if (phone) userToUpdate.phone = phone;
    if (role) userToUpdate.role = role;

    await userToUpdate.save();

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "User updated successfully",
      user: {
        id: userToUpdate._id,
        fullname: userToUpdate.fullname,
        email: userToUpdate.email,
        role: userToUpdate.role,
        phone: userToUpdate.phone,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: err.message,
    });
  }
};

// ---------------------------
// DELETE USER
// ---------------------------
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== "admin") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "Only admin can delete users",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser)
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "User not found",
      });

    res.status(StatusCodes.OK).json({ success: true, msg: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: err.message,
    });
  }
};

module.exports = { createUser, getUsers, updateUser, deleteUser };
