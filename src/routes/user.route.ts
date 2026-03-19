import express from "express";
import { userController } from "../controller/user.controller";

const router = express.Router();

// register
router.post("/register", userController.register);

// log in
router.post("/login", userController.login);

// get all users
router.get("/", userController.getUsers)

export const UserRoutes = router;