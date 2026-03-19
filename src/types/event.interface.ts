import { Types } from "mongoose";

export interface TEvent {
  title: string;
  description: string;
  date: Date;
  location: string;
  price: number;
  capacity: number;
  image: string;
  createdBy: Types.ObjectId;
  status: "pending" | "approved";
  createdAt?: Date;
  updatedAt?: Date
}