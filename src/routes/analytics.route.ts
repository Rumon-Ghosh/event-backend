import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { analyticsController } from "../controller/analytics.controller";

const route = express.Router();

route.get("/", authMiddleware, analyticsController.getAnalytics);

export const AnalyticsRoute = route;
