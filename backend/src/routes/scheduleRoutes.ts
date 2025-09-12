import { Router } from "express";
import * as scheduleController from "../controllers/scheduleController";

const router = Router();

router.post("/exceptions", scheduleController.createScheduleException);

// POST /schedules
router.post("/", scheduleController.createRecurringSchedule);

// GET /schedules?date=...
router.get("/", scheduleController.getSchedulesForWeek);

export default router;
