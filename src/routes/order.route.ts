import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { orderController } from "../controller/order.controller";

const route = express.Router();

route.post("/", authMiddleware, orderController.createOrder);

route.get("/", authMiddleware, orderController.getOrders);

route.get("/my-orders", authMiddleware, orderController.getMyOrders);

route.get("/:id", authMiddleware, orderController.orderById);

route.put("/:id/status", authMiddleware, orderController.updateOrderStatus);

route.put("/:id/quantity", authMiddleware, orderController.updateOrderQuantity);

route.delete("/:id", authMiddleware, orderController.deleteOrder);

export const OrderRoute = route;