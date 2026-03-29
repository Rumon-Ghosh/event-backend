import { Request, Response } from "express";
import { Event } from "../models/event.model";
import { Order } from "../models/order.model";

const createEvent = async (req: Request, res: Response) => {
  try {
    const eventData = await Event.create(req.body);
    res.status(201).json({
      success: true,
      message: "Event created Successfully.",
      data: eventData
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create Event.",
      error: err.message
    })
  }
}

const getEvents = async (req: Request, res: Response) => {
  try {
    const { search, sortBy, page = "1", limit = "9" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let sortOption = {};
    if(!sortBy) {
      sortOption = { createdAt: -1 };
    } else if (sortBy === "lowToHigh") {
      sortOption = { price: 1 };
    } else if (sortBy === "highToLow") {
      sortOption = { price: -1 };
    }
    const query: any = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    const allEvents = await Event.find(query).sort(sortOption).skip(skip).limit(limitNum);
    const totalEvents = await Event.countDocuments(query);
    res.status(200).json({
      success: true, 
      message: "All Event Fetched Successfully.",
      data: allEvents,
      totalEvents
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed To Fetch All Event",
      error: err.message
    })
  }
}

const getLatestEvents = async (req: Request, res: Response) => {
  try {
    const latestEvents = await Event.find().sort({ createdAt: -1 }).limit(4);
    res.status(200).json({
      success: true,
      message: "Latest Events fetched successfully.",
      data: latestEvents
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch latest events.",
      error: err.message
    });
  }
}

const getSingleEvent = async (req: Request, res: Response) => {
  try {
    const singleEvent = await Event.findById(req.params.id)
    if (!singleEvent) {
      return res.status(404).json({
        success: false,
        message: "Failed to find single event"
      })
    }
    res.status(200).json({
      success: true,
      message: "Single Event fatched successfully.",
      data: singleEvent
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fatch event.",
      error: err.message
    })
  }
}

const getMyEvents = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const myEvents = await Event.find({ createdBy: userId }).sort({createdAt: -1});

    res.status(200).json({
      success: true,
      message: "My Events fetched successfully.",
      data: myEvents
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch my events.",
      error: err.message
    });
  }
};


const updateEvent = async (req: Request, res: Response) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });

    if (!updatedEvent) {
      return res.status(400).json({
        success: false,
        message: "Cannot find event to update"
      })
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      data: updatedEvent
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: err.message,
    });
  }
}

const deleteEvent = async (req: Request, res: Response) => {
  try {
    const eventDelete = await Event.findByIdAndDelete(req.params.id);
    if (!eventDelete) {
      return res.status(400).json({
        success: false,
        message: "Cannot Delete Event."
      })
    }

    // Delete all orders related to this event
    const deletedOrders = await Order.deleteMany({ event: req.params.id });

    res.status(200).json({
      success: true,
      message: "Event and related orders deleted successfully.",
      data: eventDelete
    })

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: err.message,
    });
  }
}

export const eventController = {
  createEvent,
  getEvents,
  getLatestEvents,
  getSingleEvent,
  getMyEvents,
  updateEvent,
  deleteEvent
}