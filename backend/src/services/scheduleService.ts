import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  getDay,
} from "date-fns";
import pool from "../db";

interface Schedule {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

// UPDATED: Added logic for max 2 recurring slots per day
export const addRecurringSchedule = async (schedule: Schedule) => {
  const { day_of_week, start_time, end_time } = schedule;

  // NEW: Check for existing recurring slots on this day
  const existingSlots = await pool.query(
    "SELECT COUNT(*) FROM recurring_schedules WHERE day_of_week = $1",
    [day_of_week]
  );
  if (parseInt(existingSlots.rows[0].count, 10) >= 2) {
    throw new Error("A maximum of 2 recurring slots per day is allowed.");
  }

  const query = `
    INSERT INTO recurring_schedules (day_of_week, start_time, end_time)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [day_of_week, start_time, end_time];
  const result = await pool.query(query, values);
  return result.rows[0];
};

interface ScheduleException {
  date: string;
  start_time: string;
  end_time: string;
}

// NEW: Function to add a schedule exception
export const addScheduleException = async (exception: ScheduleException) => {
  const { date, start_time, end_time } = exception;

  // NEW: Check for existing exception slots on this date
  const existingSlots = await pool.query(
    "SELECT COUNT(*) FROM schedule_exceptions WHERE date = $1",
    [date]
  );
  if (parseInt(existingSlots.rows[0].count, 10) >= 2) {
    throw new Error("A maximum of 2 exception slots per date is allowed.");
  }

  const query = `
    INSERT INTO schedule_exceptions (date, start_time, end_time)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [date, start_time, end_time];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// UPDATED: This function is now much smarter
export const fetchWeeklySchedules = async (targetDate: Date) => {
  const start = startOfWeek(targetDate, { weekStartsOn: 0 });
  const end = endOfWeek(targetDate, { weekStartsOn: 0 });

  // UPDATED: Fetch both recurring schedules AND exceptions in parallel
  const recurringSchedulesPromise = pool.query(
    "SELECT * FROM recurring_schedules;"
  );
  const exceptionsPromise = pool.query(
    "SELECT * FROM schedule_exceptions WHERE date >= $1 AND date <= $2;",
    [format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd")]
  );

  const [recurringSchedulesResult, exceptionsResult] = await Promise.all([
    recurringSchedulesPromise,
    exceptionsPromise,
  ]);
  const allRecurringSlots = recurringSchedulesResult.rows;
  const exceptions = exceptionsResult.rows;

  const weekDates = eachDayOfInterval({ start, end });
  const finalSchedule = new Map<string, any[]>();

  // Initialize with empty arrays
  weekDates.forEach((date) => {
    finalSchedule.set(format(date, "yyyy-MM-dd"), []);
  });

  // Apply the recurring schedule logic first
  for (const date of weekDates) {
    const dayOfWeek = getDay(date);
    const dateString = format(date, "yyyy-MM-dd");
    const applicableSlots = allRecurringSlots.filter(
      (slot) => slot.day_of_week === dayOfWeek
    );
    if (applicableSlots.length > 0) {
      finalSchedule.set(dateString, applicableSlots);
    }
  }

  // NEW: Apply exceptions, overriding the recurring schedule
  const exceptionsHandledForDate = new Set<string>();
  for (const exception of exceptions) {
    const dateString = format(new Date(exception.date), "yyyy-MM-dd");

    // If this is the first time we see an exception for this date,
    // it means the recurring schedule for this day is void. So, we wipe it.
    if (!exceptionsHandledForDate.has(dateString)) {
      finalSchedule.set(dateString, []);
      exceptionsHandledForDate.add(dateString);
    }

    //Added the exception slot to the (now possibly empty) list.
    finalSchedule.get(dateString)?.push(exception);
  }

  return Object.fromEntries(finalSchedule);
};
