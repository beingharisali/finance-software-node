


// // const User = require("../models/User");
// // const { StatusCodes } = require("http-status-codes");
// // const { BadRequestError, UnauthorizedError, NotFoundError } = require("../errors");

// // // ---------------------------
// // // CREATE USER
// // // ---------------------------
// // const createUser = async (req, res) => {
// //   try {
// //     const { fullname, email, password, role } = req.body;
// //     if (!fullname || !email || !password || !role)
// //       throw new BadRequestError("Provide all required fields");

// //     const creatorRole = req.user.role;

// //     const allowedRolesByCreator = {
// //       admin: ["admin", "manager", "agent", "broker"],
// //       manager: ["agent", "broker"],
// //     };

// //     if (!allowedRolesByCreator[creatorRole]?.includes(role)) {
// //       return res.status(StatusCodes.FORBIDDEN).json({
// //         success: false,
// //         msg: `You (${creatorRole}) cannot create a user with role ${role}`,
// //       });
// //     }

// //     const existingUser = await User.findOne({ email });
// //     if (existingUser)
// //       return res
// //         .status(StatusCodes.BAD_REQUEST)
// //         .json({ success: false, msg: "Email already registered" });

// //     const user = await User.create({
// //       fullname,
// //       email,
// //       password,
// //       role,
// //       createdBy: req.user.userId,
// //     });

// //     res.status(StatusCodes.CREATED).json({
// //       success: true,
// //       msg: "User created successfully",
// //       user: {
// //         id: user._id,
// //         fullname: user.fullname,
// //         email: user.email,
// //         role: user.role,
// //       },
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res
// //       .status(StatusCodes.INTERNAL_SERVER_ERROR)
// //       .json({ success: false, msg: error.message });
// //   }
// // };

// // // ---------------------------
// // // GET USERS
// // // ---------------------------
// // const getUsers = async (req, res) => {
// //   try {
// //     const { role } = req.query;
// //     let filter = {};

// //     if (req.user.role === "manager") {
// //       filter.createdBy = req.user.userId;
// //     }

// //     if (role && role !== "all") {
// //       filter.role = role;
// //     }

// //     const users = await User.find(filter)
// //       .select("-password")
// //       .populate("createdBy", "fullname role")
// //       .sort({ createdAt: -1 });

// //     res.status(StatusCodes.OK).json({ success: true, users });
// //   } catch (err) {
// //     console.error(err);
// //     res
// //       .status(StatusCodes.INTERNAL_SERVER_ERROR)
// //       .json({ success: false, msg: err.message });
// //   }
// // };

// // // ---------------------------
// // // UPDATE USER
// // // ---------------------------
// // const updateUser = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { fullname, email, role, phone } = req.body;

// //     const userToUpdate = await User.findById(id);
// //     if (!userToUpdate) throw new NotFoundError("User not found");

// //     // Only admin can change roles
// //     if (role && req.user.role !== "admin") {
// //       return res.status(StatusCodes.FORBIDDEN).json({
// //         success: false,
// //         msg: "Only admin can change roles",
// //       });
// //     }

// //     userToUpdate.fullname = fullname || userToUpdate.fullname;
// //     userToUpdate.email = email || userToUpdate.email;
// //     userToUpdate.phone = phone || userToUpdate.phone;
// //     if (role) userToUpdate.role = role;

// //     await userToUpdate.save();

// //     res.status(StatusCodes.OK).json({
// //       success: true,
// //       msg: "User updated successfully",
// //       user: {
// //         id: userToUpdate._id,
// //         fullname: userToUpdate.fullname,
// //         email: userToUpdate.email,
// //         role: userToUpdate.role,
// //         phone: userToUpdate.phone,
// //       },
// //     });
// //   } catch (err) {
// //     console.error(err);
// //     res
// //       .status(StatusCodes.INTERNAL_SERVER_ERROR)
// //       .json({ success: false, msg: err.message });
// //   }
// // };

// // // ---------------------------
// // // DELETE USER
// // // ---------------------------
// // const deleteUser = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     if (req.user.role !== "admin") {
// //       return res.status(StatusCodes.UNAUTHORIZED).json({
// //         success: false,
// //         msg: "Only admin can delete users",
// //       });
// //     }

// //     const deletedUser = await User.findByIdAndDelete(id);
// //     if (!deletedUser)
// //       return res.status(StatusCodes.NOT_FOUND).json({
// //         success: false,
// //         msg: "User not found",
// //       });

// //     res.status(StatusCodes.OK).json({ success: true, msg: "User deleted successfully" });
// //   } catch (err) {
// //     console.error(err);
// //     res
// //       .status(StatusCodes.INTERNAL_SERVER_ERROR)
// //       .json({ success: false, msg: err.message });
// //   }
// // };

// // module.exports = { createUser, getUsers, updateUser, deleteUser };
// const User = require("../models/User");
// const { StatusCodes } = require("http-status-codes");
// const { BadRequestError, UnauthorizedError, NotFoundError } = require("../errors");

// // ---------------------------
// // CREATE USER
// // ---------------------------
// const createUser = async (req, res) => {
//   try {
//     const { fullname, email, password, role } = req.body;
//     if (!fullname || !email || !password || !role)
//       throw new BadRequestError("Provide all required fields");

//     const creatorRole = req.user.role;

//     const allowedRolesByCreator = {
//       admin: ["admin", "manager", "agent", "broker"],
//       manager: ["agent", "broker"],
//     };

//     if (!allowedRolesByCreator[creatorRole]?.includes(role)) {
//       return res.status(StatusCodes.FORBIDDEN).json({
//         success: false,
//         msg: `You (${creatorRole}) cannot create a user with role ${role}`,
//       });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ success: false, msg: "Email already registered" });

//     const user = await User.create({
//       fullname,
//       email,
//       password,
//       role,
//       createdBy: req.user.userId,
//     });

//     res.status(StatusCodes.CREATED).json({
//       success: true,
//       msg: "User created successfully",
//       user: {
//         id: user._id,
//         fullname: user.fullname,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ success: false, msg: error.message });
//   }
// };

// // ---------------------------
// // GET USERS (Updated for Manager & Admin)
// // ---------------------------
// const getUsers = async (req, res) => {
//   try {
//     const { role } = req.query; // optional query param to filter by role
//     let filter = {};

//     // Filter by role if provided
//     if (role && role !== "all") {
//       filter.role = role;
//     }

//     // Admin -> no additional filter
//     // Manager -> only agents/brokers (created by admin OR manager) 
//     if (req.user.role === "manager") {
//       filter.role = filter.role || { $in: ["agent", "broker"] };
//     }

//     const users = await User.find(filter)
//       .select("-password")
//       .populate("createdBy", "fullname role")
//       .sort({ createdAt: -1 });

//     res.status(StatusCodes.OK).json({ success: true, users });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ success: false, msg: err.message });
//   }
// };

// // ---------------------------
// // UPDATE USER
// // ---------------------------
// const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { fullname, email, role, phone } = req.body;

//     const userToUpdate = await User.findById(id);
//     if (!userToUpdate) throw new NotFoundError("User not found");

//     // Only admin can change roles
//     if (role && req.user.role !== "admin") {
//       return res.status(StatusCodes.FORBIDDEN).json({
//         success: false,
//         msg: "Only admin can change roles",
//       });
//     }

//     userToUpdate.fullname = fullname || userToUpdate.fullname;
//     userToUpdate.email = email || userToUpdate.email;
//     userToUpdate.phone = phone || userToUpdate.phone;
//     if (role) userToUpdate.role = role;

//     await userToUpdate.save();

//     res.status(StatusCodes.OK).json({
//       success: true,
//       msg: "User updated successfully",
//       user: {
//         id: userToUpdate._id,
//         fullname: userToUpdate.fullname,
//         email: userToUpdate.email,
//         role: userToUpdate.role,
//         phone: userToUpdate.phone,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ success: false, msg: err.message });
//   }
// };

// // ---------------------------
// // DELETE USER
// // ---------------------------
// const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (req.user.role !== "admin") {
//       return res.status(StatusCodes.UNAUTHORIZED).json({
//         success: false,
//         msg: "Only admin can delete users",
//       });
//     }

//     const deletedUser = await User.findByIdAndDelete(id);
//     if (!deletedUser)
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         msg: "User not found",
//       });

//     res.status(StatusCodes.OK).json({ success: true, msg: "User deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ success: false, msg: err.message });
//   }
// };

// module.exports = { createUser, getUsers, updateUser, deleteUser };
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

// ---------------------------
// CREATE USER
// ---------------------------
const createUser = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    if (!fullname || !email || !password || !role) {
      throw new BadRequestError("Provide all required fields");
    }

    const creatorRole = req.user.role;

    // Admin can create anyone; Manager can only create agent or broker
    const allowedRolesByCreator = {
      admin: ["admin", "manager", "agent", "broker"],
      manager: ["agent", "broker"],
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message,
    });
  }
};

// ---------------------------
// GET USERS (Admin + Manager)
// ---------------------------
const getUsers = async (req, res) => {
  try {
    const { role } = req.query; // optional filter
    let filter = {};

    // Manager should only see agents & brokers
    if (req.user.role === "manager") {
      filter.role = { $in: ["agent", "broker"] };
    }

    // Role filter applied if query param exists
    if (role && role !== "all") {
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

    // Only admin can change roles
    if (role && req.user.role !== "admin") {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "Only admin can change roles",
      });
    }

    userToUpdate.fullname = fullname || userToUpdate.fullname;
    userToUpdate.email = email || userToUpdate.email;
    userToUpdate.phone = phone || userToUpdate.phone;
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

    // Only admin can delete users
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
