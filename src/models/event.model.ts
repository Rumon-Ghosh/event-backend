import { model, Schema } from "mongoose";
import { TEvent } from "../types/event.interface";
import { User } from "./user.model";

const eventSchema = new Schema<TEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  capacity: { type: Number, required: true, default: 50 },
  image: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: User, required: true },
  status: {
    type: String, enum: ["pending", "approved"], default: "pending"
  }
},
  {
    timestamps: true
  }
)

export const Event = model<TEvent>("Event", eventSchema)