import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Event } from "../models/event.model";

const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { eventId, quantity } = req.body;

    // Atomic update to prevent race conditions during concurrent bookings
    const event = await Event.findOneAndUpdate(
      { _id: eventId, capacity: { $gte: quantity } },
      { $inc: { capacity: -quantity } },
      { returnDocument: "after" }
    );

    if (!event) {
      // Check if event exists but full, or entirely missing
      const existingEvent = await Event.findById(eventId);
      if (!existingEvent) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }
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

const getOrders = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required",
      });
    }

    const orders = await Order.find()
      .populate("event", "title date price")
      .populate("user", "name email");

    if (!orders) {
      return res.status(404).json({
        success: false,
        message: "Orders not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      data: orders,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error on fetching orders.",
      error: err.message,
    });
  }
};

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user?.id })
      .populate("event", "title date price")
      .populate("user", "name email");

    if (!orders) {
      return res.status(404).json({
        success: false,
        message: "Orders not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      data: orders,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error on fetching orders.",
      error: err.message,
    });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Refund capacity if order is being cancelled
    if (req.body.orderStatus === "cancelled" && order.orderStatus !== "cancelled") {
      await Event.findByIdAndUpdate(order.event, { $inc: { capacity: order.quantity } });
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: updatedOrder,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error on updating order status.",
      error: err.message,
    });
  }
};

const updateOrderQuantity = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const { quantity: newQuantity } = req.body;

    const order = await Order.findById(orderId).populate("event");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Ownership check: Only the order owner or an admin can update
    if (order.user.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not allowed to update this order",
      });
    }

    const event = order.event as any;
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Associated event not found",
      });
    }

    const diff = newQuantity - order.quantity;

    // Atomic update to event capacity to ensure availability
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: event._id, capacity: { $gte: diff } },
      { $inc: { capacity: -diff } },
      { returnDocument: "after" }
    );

    if (!updatedEvent) {
      return res.status(400).json({
        success: false,
        message: "Not enough seats available to update quantity",
      });
    }

    const newTotalPrice = newQuantity * event.price;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { quantity: newQuantity, totalPrice: newTotalPrice },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Order quantity updated successfully.",
      data: updatedOrder,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error on updating order quantity.",
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

    const orderUserId = (order.user as any)._id.toString();
    if (orderUserId !== req.user?.id && req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not allowed to view this order",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order fetched successfully.",
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

    if (order.orderStatus !== "cancelled") {
      const event = await Event.findById(order.event);
      if (event) {
        event.capacity += order.quantity;
        await event.save();
      }
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
  deleteOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
  updateOrderQuantity
};
