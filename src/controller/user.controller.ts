import { Request, Response } from "express";
import { User } from "../models/user.model";
import jwt, { Secret } from "jsonwebtoken";
import config from "../config";
import bcrypt from "bcrypt";

const getMe = async (req: Request, res: Response) => {
  try {
    let token = req.headers.authorization || req.cookies.token;

    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Not logged in",
        data: null,
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, config.jwt_secret as string) as any;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    res.status(200).json({
      success: false,
      message: "Invalid session",
      data: null,
    });
  }
};

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

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

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

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const users = await User.find({role: {$nin: ["admin"]}})
    .sort({createdAt: -1})
    .select("-password")
    .skip(skip)
    .limit(limit);
    const totalUsers = await User.countDocuments({role: {$nin: ["admin"]}});
    const totalPages = Math.ceil(totalUsers / limit);
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbiden access denied.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Users fatched successfully",
      data: users,
      totalUsers,
      totalPages,
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
      returnDocument: "after",
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
      data: deletedValue,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error on delete user",
      error: err.message,
    });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully.",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error on logout.",
      error: err.message,
    });
  }
};

export const userController = {
  register,
  login,
  getUsers,
  updateUsers,
  deleteUsers,
  logout,
  getMe,
};
