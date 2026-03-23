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
router.get("/", userController.getUsers)

// update users
router.patch("/", userController.updateUsers);

// delete users
router.delete("/", userController.deleteUsers)

export const UserRoutes = router;