import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { reviewController } from "../controller/review.controller";
const route = express.Router();

route.post("/", authMiddleware, reviewController.createReview);
route.get("/", authMiddleware, reviewController.getReviews);
route.get("/:id", authMiddleware, reviewController.getReviewById);
route.put("/:id", authMiddleware, reviewController.updateReview);
route.delete("/:id", authMiddleware, reviewController.deleteReview);

export const ReviewRoute = route;