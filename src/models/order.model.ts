import { model, Schema } from "mongoose";
import { TOrder } from "../types/order.interface";
import { User } from "./user.model";
import { Event } from "./event.model";

const orderSchema = new Schema<TOrder>({
  user: { type: Schema.Types.ObjectId, ref: User, required: true },
  event: { type: Schema.Types.ObjectId, ref: Event, required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: {type: Number, required: true},
  orderStatus: {type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending"}
},
  {
  timestamps: true
}
)

export const Order = model<TOrder>("Order", orderSchema)