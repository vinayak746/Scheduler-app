import { Router } from "express";
import * as scheduleController from "../controllers/scheduleController";

const router = Router();

router.post("/", scheduleController.createRecurringSchedule);

export default router;
