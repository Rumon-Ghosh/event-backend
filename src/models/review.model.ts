import { model, Schema } from "mongoose";
import { TReview } from "../types/review.interface";

const reviewSchema = new Schema<TReview>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
},
  {
   timestamps: true
 })

export const Review = model<TReview>("Review", reviewSchema);