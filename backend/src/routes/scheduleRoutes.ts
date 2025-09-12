import { Router } from "express";
import * as scheduleController from "../controllers/scheduleController";

const router = Router();

// POST /schedules
router.post("/", scheduleController.createRecurringSchedule);

// GET /schedules?date=...
router.get("/", scheduleController.getSchedulesForWeek); // Add this line

export default router;
