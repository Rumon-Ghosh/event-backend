import { Types } from "mongoose";

export interface TOrder {
  user: Types.ObjectId;
  event: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  orderStatus: "pending" | "confirmed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

