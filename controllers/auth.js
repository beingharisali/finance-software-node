const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  res.status(StatusCodes.CREATED).json({
    success: true,
    msg:'User registered successfully'
  });
};

const login = async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    msg:'User logged in successfully'
  });
};
const getProfile = async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    msg:'User Profile Info'
  });
};

module.exports = { register, login, getProfile };
