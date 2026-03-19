import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Event } from "../models/event.model";

const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { event: eventId, quantity } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.capacity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough seats available",
      });
    }

    const totalPrice = event.price * quantity;

    const order = await Order.create({
      user: userId,
      event: eventId,
      quantity,
      totalPrice,
      orderStatus: "pending",
    });

    event.capacity -= quantity;
    await event.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: order,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error on creating order.",
      error: err.message,
    });
  }
};

const orderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("event", "title date price")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order by id successfully.",
      data: order,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error on get single order.",
    });
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (
      order.user.toString() !== req.user?.id &&
      req.user?.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    const event = await Event.findById(order.event);
    if (event) {
      event.capacity += order.quantity;
      await event.save();
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully."
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error on delete order.",
      error: err.message
    });
  }
};

export const orderController = {
  createOrder,
  orderById,
  deleteOrder
};
