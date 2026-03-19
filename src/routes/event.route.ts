import express from "express";
import { eventController } from "../controller/event.controller";

const router = express.Router();

router.post("/", eventController.createEvent);

router.get("/", eventController.getEvents);

router.get("/:id", eventController.getSingleEvent);

router.patch("/:id", eventController.updateEvent);

router.delete("/:id", eventController.deleteEvent)

export const EventRoutes = router;