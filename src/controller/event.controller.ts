import { Request, Response } from "express";
import { Event } from "../models/event.model";

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
    const allEvents = await Event.find();
    res.status(200).json({
      success: true, 
      message: "All Event Fatched Successfully.",
      data: allEvents
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed To Fatche All Event",
      error: err.message
    })
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

const updateEvent = async (req: Request, res: Response) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

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

    res.status(200).json({
      success: true, 
      message: "Event Deleted successfully.",
      data: eventDelete
    })

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: err.message,
    });
  }
}

export const eventController = {
  createEvent,
  getEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent
}