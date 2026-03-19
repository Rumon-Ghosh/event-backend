import { Request, Response } from "express";
import { Order } from "../models/order.model";

const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const order = await Order.create(req.body);
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Cannot create order."
      })
    }
    res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: order
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error on creating order.",
      error: err.message
    })
  }
}


export const orderController = {
  createOrder,
} 
