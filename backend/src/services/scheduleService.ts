import pool from "../db";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  getDay,
} from "date-fns";

interface Schedule {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export const addRecurringSchedule = async (schedule: Schedule) => {
  const { day_of_week, start_time, end_time } = schedule;

  // Use parameterized query to prevent SQL injection
  const query = `
    INSERT INTO recurring_schedules (day_of_week, start_time, end_time)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [day_of_week, start_time, end_time];

  const result = await pool.query(query, values);
  return result.rows[0];
};
export const fetchWeeklySchedules = async (targetDate: Date) => {
  // Step 1: Calculate the start and end of the week for the given date.
  // We'll define a week as starting on Sunday.
  const start = startOfWeek(targetDate, { weekStartsOn: 0 });
  const end = endOfWeek(targetDate, { weekStartsOn: 0 });

  // Step 2: Fetch ALL recurring schedules and any exceptions within our date range.
  // For now, we only fetch recurring schedules. We'll handle exceptions later.
  const recurringSchedulesPromise = pool.query(
    "SELECT * FROM recurring_schedules;"
  );
  // In the future, we'll also fetch from schedule_exceptions here.
  // const exceptionsPromise = pool.query('...');

  const [recurringSchedulesResult] = await Promise.all([
    recurringSchedulesPromise,
  ]);
  const allRecurringSlots = recurringSchedulesResult.rows;

  // Step 3: Process the data.
  // Create a list of all 7 days in the target week.
  const weekDates = eachDayOfInterval({ start, end });

  // Use a Map to build our final schedule. The key will be the date string (e.g., "2025-09-14").
  const finalSchedule = new Map<string, any[]>();

  // Initialize the map with empty arrays for each day of the week.
  weekDates.forEach((date) => {
    finalSchedule.set(format(date, "yyyy-MM-dd"), []);
  });

  // Step 4: Apply the recurring schedule logic.
  // Go through each day of the week we're building the schedule for.
  for (const date of weekDates) {
    const dayOfWeek = getDay(date); // 0 for Sunday, 1 for Monday, etc.
    const dateString = format(date, "yyyy-MM-dd");

    // Find all recurring slots that should happen on this day of the week.
    const applicableSlots = allRecurringSlots.filter(
      (slot) => slot.day_of_week === dayOfWeek
    );

    // Add them to our map for that specific date.
    if (applicableSlots.length > 0) {
      finalSchedule.set(dateString, applicableSlots);
    }
  }

  // Step 5: (Future) Apply exceptions here. We'll do this in the next task.

  // Convert the Map to a plain object for the JSON response.
  return Object.fromEntries(finalSchedule);
};
