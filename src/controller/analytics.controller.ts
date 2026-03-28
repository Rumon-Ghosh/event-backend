import { Request, Response } from "express";
import { Event } from "../models/event.model";
import { Order } from "../models/order.model";
import { User } from "../models/user.model";

const getAnalytics = async (req: Request, res: Response) => {
  try {

    // --- Summary counts ---
    const [totalEvents, totalOrders, totalUsers] = await Promise.all([
      Event.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: { $ne: "admin" } }),
    ]);

    // --- Total revenue ---
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total ?? 0;

    // --- Orders & Revenue per month (last 6 months) ---
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          orders: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $ne: ["$orderStatus", "cancelled"] }, "$totalPrice", 0],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = monthlyAgg.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      orders: item.orders,
      revenue: item.revenue,
    }));

    // --- Orders by status ---
    const statusAgg = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);
    const ordersByStatus = statusAgg.map((item) => ({
      status: item._id,
      count: item.count,
    }));

    // --- Top 5 events by booking count ---
    const topEventsAgg = await Order.aggregate([
      { $group: { _id: "$event", bookings: { $sum: "$quantity" } } },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventInfo",
        },
      },
      { $unwind: "$eventInfo" },
      {
        $project: {
          _id: 0,
          title: "$eventInfo.title",
          bookings: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Analytics fetched successfully.",
      data: {
        summary: { totalEvents, totalOrders, totalRevenue, totalUsers },
        monthlyData,
        ordersByStatus,
        topEvents: topEventsAgg,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics.",
      error: err.message,
    });
  }
};

export const analyticsController = { getAnalytics };
