import { Request, Response } from "express";
import { User } from "../models/user.model";
import jwt, { Secret } from "jsonwebtoken";
import config from "../config";
import bcrypt from "bcrypt";

const register = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const isExistUser = await User.findOne({ email });
    if (isExistUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }
    const savedUser = await User.create(req.body);

    const token = jwt.sign(
      { userId: savedUser._id, role: savedUser.role },
      config.jwt_secret as Secret,
      { expiresIn: config.jwt_expires_in as any },
    );

    const userResponse = savedUser.toObject();

    res.status(201).json({
      success: true,
      message: "User created successful",
      data: userResponse,
      token,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to register user.",
      error: err.message,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const getUser = await User.findOne({ email }).select("+password");
    if (!getUser) {
      return res.status(500).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordOk = await bcrypt.compare(
      password,
      getUser.password as string,
    );
    if (!isPasswordOk) {
      return res.status(500).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: getUser._id, role: getUser.role },
      config.jwt_secret as Secret,
      { expiresIn: config.jwt_expires_in as any },
    );

    const userResponse = getUser.toObject();

    res.status(200).json({
      success: true,
      message: "User Logged in successfully",
      data: userResponse,
      token,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Log in failed",
      error: err.message,
    });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      message: "Users fatched successfully",
      data: users,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fatched users",
      error: err.message,
    });
  }
};

const updateUsers = async (req: Request, res: Response) => {
  try {
    const updatedValue = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedValue) {
      return res.status(400).json({
        success: false,
        message: "Cannot update a user value.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: updatedValue,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error on update user.",
      error: err.message,
    });
  }
};

const deleteUsers = async (req: Request, res: Response) => {
  try {
    const deletedValue = await User.findByIdAndDelete(req.params.id);
    if (!deletedValue) {
      return res.status(400).json({
        success: false,
        message: "Error on delete User.",
      });
    }
    res.status(200).json({
      success: true, 
      message: "User deleted successfully.",
      data: deletedValue
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error on delete user",
      error: err.message
    })
  }
};

export const userController = {
  register,
  login,
  getUsers,
  updateUsers,
  deleteUsers
};
