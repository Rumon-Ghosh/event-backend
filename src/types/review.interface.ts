import { Types } from "mongoose";

export interface TReview {
  user: Types.ObjectId;
  event: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}