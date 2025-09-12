import { Request, Response } from "express";
import * as scheduleService from "../services/scheduleService";

export const createRecurringSchedule = async (req: Request, res: Response) => {
  try {
    const { day_of_week, start_time, end_time } = req.body;

    // Basic validation
    if (day_of_week === undefined || !start_time || !end_time) {
      return res.status(400).json({
        error: "Missing required fields: day_of_week, start_time, end_time",
      });
    }
    if (typeof day_of_week !== "number" || day_of_week < 0 || day_of_week > 6) {
      return res.status(400).json({
        error: "Invalid day_of_week. Must be an integer between 0 and 6.",
      });
    }

    const newSchedule = await scheduleService.addRecurringSchedule({
      day_of_week,
      start_time,
      end_time,
    });

    res.status(201).json({
      message: "Recurring schedule created successfully",
      schedule: newSchedule,
    });
  } catch (error) {
    console.error("Error creating recurring schedule:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

export const getSchedulesForWeek = async (req: Request, res: Response) => {
  try {
    // The target date can be passed as a query param, e.g., /schedules?date=2025-09-14
    // If no date is provided, we'll default to the current date.
    const dateQuery = req.query.date as string | undefined;
    const targetDate = dateQuery ? new Date(dateQuery) : new Date();

    // Check if the provided date string is valid
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format provided." });
    }

    const schedule = await scheduleService.fetchWeeklySchedules(targetDate);
    res.status(200).json(schedule);
  } catch (error) {
    console.error("Error fetching weekly schedule:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};
