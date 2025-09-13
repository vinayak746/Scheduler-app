import { Router } from "express";
import * as scheduleController from "../controllers/scheduleController";

// Express Router is like a mini-app, capable of having its own middleware and routing.
// We use it to keep all schedule-related routes organized in one place.
const router = Router();

/**
 * METHOD: GET
 * URL: /schedules?date=YYYY-MM-DD
 * DESC: Fetches the calculated schedule for a given week.
 * The 'date' query parameter is optional and defaults to the current date.
 */
router.get("/", scheduleController.getSchedulesForWeek);

/**
 * METHOD: POST
 * URL: /schedules
 * DESC: Creates a new base recurring schedule (e.g., every Monday at 9 AM).
 */
router.post("/", scheduleController.createRecurringSchedule);

/**
 * METHOD: POST
 * URL: /schedules/exceptions
 * DESC: Creates a new one-time exception that overrides the recurring schedule
 * for a specific date.
 */
router.post("/exceptions", scheduleController.createScheduleException);

/**
 * METHOD: DELETE
 * URL: /schedules/YYYY-MM-DD
 * DESC: Creates a "cancellation" exception for a specific date, ensuring no
 * slots (recurring or otherwise) appear on that day.
 */
router.delete("/exceptions/:id", scheduleController.deleteExceptionById);

router.delete("/:date", scheduleController.deleteScheduleForDate);

export default router;
