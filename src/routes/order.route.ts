import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { orderController } from "../controller/order.controller";

const route = express.Router();

route.post("/", authMiddleware, orderController.createOrder);

export const OrderRoute = route;