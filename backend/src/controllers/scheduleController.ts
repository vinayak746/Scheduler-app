import { Request, Response } from "express";
import * as scheduleService from "../services/scheduleService";

/**
 * Controller functions are the "glue" between the HTTP layer and the business logic layer.
 * Their primary responsibilities are:
 * 1. Handling the request (req) and response (res) objects.
 * 2. Validating incoming data from the request body, params, or query.
 * 3. Calling the appropriate service function to perform the core logic.
 * 4. Sending back an appropriate HTTP response (e.g., JSON data or an error status).
 */

export const createRecurringSchedule = async (req: Request, res: Response) => {
  try {
    // Extract data from the incoming request's JSON body.
    const { day_of_week, start_time, end_time } = req.body;

    // Perform basic input validation.
    if (day_of_week === undefined || !start_time || !end_time) {
      return res.status(400).json({
        error: "Missing required fields: day_of_week, start_time, end_time",
      });
    }
    // ... more validation ...

    // Delegate the actual database work to the service layer.
    const newSchedule = await scheduleService.addRecurringSchedule({
      day_of_week,
      start_time,
      end_time,
    });

    // Send a success response. 201 means "Created".
    res.status(201).json({
      message: "Recurring schedule created successfully",
      schedule: newSchedule,
    });
  } catch (error) {
    // This custom error handling checks for specific business rule violations
    // (like "max 2 slots") and sends a user-friendly 400 error.
    if (error instanceof Error && error.message.includes("maximum of 2")) {
      return res.status(400).json({ error: error.message });
    }
    // For all other unexpected errors, send a generic 500 server error.
    console.error("Error creating recurring schedule:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

export const getSchedulesForWeek = async (req: Request, res: Response) => {
  try {
    // Extract the optional 'date' from the URL query string (e.g., /schedules?date=...).
    const dateQuery = req.query.date as string | undefined;
    // If no date is provided, default to the current date.
    const targetDate = dateQuery ? new Date(dateQuery) : new Date();

    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format provided." });
    }

    // Call the service to perform the complex schedule calculation.
    const schedule = await scheduleService.fetchWeeklySchedules(targetDate);

    // Send the calculated schedule back to the client.
    res.status(200).json(schedule);
  } catch (error) {
    console.error("Error fetching weekly schedule:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

export const createScheduleException = async (req: Request, res: Response) => {
  try {
    const { date, start_time, end_time } = req.body;

    if (!date || !start_time || !end_time) {
      return res
        .status(400)
        .json({ error: "Missing required fields: date, start_time, end_time" });
    }

    const newException = await scheduleService.addScheduleException({
      date,
      start_time,
      end_time,
    });
    res.status(201).json({
      message: "Schedule exception created successfully",
      exception: newException,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("maximum of 2")) {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error creating schedule exception:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

export const deleteScheduleForDate = async (req: Request, res: Response) => {
  try {
    // Extract the date from the URL parameters (e.g., /schedules/2025-10-01).
    const { date } = req.params;

    // Use a regular expression to validate the date format.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ error: "Invalid date format. Use YYYY-MM-DD." });
    }

    await scheduleService.addCancellation(date);
    res
      .status(200)
      .json({ message: `Schedule for date ${date} has been cancelled.` });
  } catch (error) {
    console.error("Error cancelling schedule:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

export const deleteExceptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exceptionId = parseInt(id, 10);
    if (isNaN(exceptionId)) {
      return res.status(400).json({ error: "Invalid exception ID." });
    }
    await scheduleService.deleteScheduleException(exceptionId);
    res
      .status(200)
      .json({ message: "Schedule exception deleted successfully." });
  } catch (error) {
    console.error("Error deleting exception:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

export const updateExceptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exceptionId = parseInt(id, 10);
    const { start_time, end_time } = req.body;

    if (isNaN(exceptionId)) {
      return res.status(400).json({ error: "Invalid exception ID." });
    }
    if (!start_time || !end_time) {
      return res
        .status(400)
        .json({ error: "Start time and end time are required." });
    }

    const updatedException = await scheduleService.updateScheduleException(
      exceptionId,
      { start_time, end_time }
    );
    res
      .status(200)
      .json({
        message: "Schedule exception updated successfully.",
        exception: updatedException,
      });
  } catch (error) {
    console.error("Error updating exception:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};
