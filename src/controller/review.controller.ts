import { Request, Response } from "express";
import { Review } from "../models/review.model";

const createReview = async (req: Request, res: Response) => {
  try {
    const { event, rating, comment } = req.body;
    const user = req.user?.id;

    const review = await Review.create({ user, event, rating, comment });

    res.status(201).json({
      success: true,
      message: "Review created successfully.",
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error on creating review.",
      error: error.message,
    });
  }
};

const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("event", "title date");

    if (!reviews) {
      return res.status(404).json({
        success: false,
        message: "Reviews not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully.",
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error on fetching reviews.",
      error: error.message,
    });
  }
};

const getReviewById = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "name email")
      .populate("event", "title date");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review fetched successfully.",
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error on fetching review.",
      error: error.message,
    });
  }
};

const updateReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (
      review.user.toString() !== req.user?.id &&
      req.user?.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not allowed to update this review",
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      data: updatedReview,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error on updating review.",
      error: error.message,
    });
  }
};

const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (
      review.user.toString() !== req.user?.id &&
      req.user?.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not allowed to delete this review",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error on deleting review.",
      error: error.message,
    });
  }
};

export const reviewController = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
};