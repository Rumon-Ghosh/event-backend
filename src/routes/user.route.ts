import express from "express";
import { userController } from "../controller/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// register
router.post("/register", userController.register);

// log in
router.post("/login", userController.login);

// logout
router.post("/logout", userController.logout);

// get me
router.get("/me", userController.getMe);

// get all users
router.get("/", authMiddleware, userController.getUsers)

// update users
router.patch("/:id", userController.updateUsers);

// delete users
router.delete("/:id", userController.deleteUsers)

export const UserRoutes = router;