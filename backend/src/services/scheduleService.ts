import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  getDay,
} from "date-fns";
import pool from "../db";

/**
 * Service functions contain the core business logic of the application.
 * They are responsible for interacting with the database and performing calculations.
 * They should be independent of the HTTP layer (i.e., they don't know about `req` or `res`).
 */

// An interface defining the shape of a recurring schedule object.
interface Schedule {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

// An interface defining the shape of a one-time exception object.
interface ScheduleException {
  date: string;
  start_time: string;
  end_time: string;
}

export const addRecurringSchedule = async (schedule: Schedule) => {
  const { day_of_week, start_time, end_time } = schedule;

  // Business Rule: Enforce a maximum of 2 recurring slots per day of the week.
  // This query checks the database before attempting to insert a new row.
  const existingSlots = await pool.query(
    "SELECT COUNT(*) FROM recurring_schedules WHERE day_of_week = $1",
    [day_of_week]
  );
  if (parseInt(existingSlots.rows[0].count, 10) >= 2) {
    // If the rule is violated, we throw an error that the controller will catch.
    throw new Error("A maximum of 2 recurring slots per day is allowed.");
  }

  // Parameterized queries ($1, $2, ...) are crucial for preventing SQL injection attacks.
  // The 'RETURNING *' clause returns the row that was just inserted.
  const query = `
    INSERT INTO recurring_schedules (day_of_week, start_time, end_time)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [day_of_week, start_time, end_time];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const addScheduleException = async (exception: ScheduleException) => {
  const { date, start_time, end_time } = exception;

  // Business Rule: Enforce a maximum of 2 override slots for any specific date.
  const existingSlots = await pool.query(
    "SELECT COUNT(*) FROM schedule_exceptions WHERE date = $1 AND type = 'override'",
    [date]
  );
  if (parseInt(existingSlots.rows[0].count, 10) >= 2) {
    throw new Error("A maximum of 2 exception slots per date is allowed.");
  }

  const query = `
    INSERT INTO schedule_exceptions (date, start_time, end_time, type)
    VALUES ($1, $2, $3, 'override')
    RETURNING *;
  `;
  const values = [date, start_time, end_time];
  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Creates a "cancellation" record for a specific date.
 * This function uses a database transaction to ensure data integrity.
 * A transaction is an "all or nothing" operation. If any part of it fails,
 * the entire operation is rolled back as if it never happened.
 */
export const addCancellation = async (date: string) => {
  // Check out a dedicated client from the pool to manage the transaction.
  const client = await pool.connect();
  try {
    // BEGIN: Starts the transaction block.
    await client.query("BEGIN");

    // First, delete any existing exceptions for this date to avoid conflicts.
    await client.query("DELETE FROM schedule_exceptions WHERE date = $1", [
      date,
    ]);
    // Then, insert a single "cancellation" marker.
    const query = `
      INSERT INTO schedule_exceptions (date, type)
      VALUES ($1, 'cancellation')
      RETURNING *;
    `;
    const result = await client.query(query, [date]);

    // COMMIT: If both operations were successful, save the changes permanently.
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    // ROLLBACK: If any error occurred, undo all changes made since 'BEGIN'.
    await client.query("ROLLBACK");
    throw error;
  } finally {
    // Release the client back to the connection pool, making it available for other requests.
    // This is extremely important to prevent connection leaks.
    client.release();
  }
};

/**
 * Calculates the final schedule for a given week by combining recurring rules and exceptions.
 */
export const fetchWeeklySchedules = async (targetDate: Date) => {
  // STEP 1: Define the week's boundaries (e.g., Sunday Sept 7 to Saturday Sept 13).
  const start = startOfWeek(targetDate, { weekStartsOn: 0 });
  const end = endOfWeek(targetDate, { weekStartsOn: 0 });

  // STEP 2: Fetch all necessary data in parallel for efficiency.
  // We get ALL recurring rules, and all exceptions that fall within our week.
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

  // Initialize our schedule map with an empty array for each day of the week.
  weekDates.forEach((date) => {
    finalSchedule.set(format(date, "yyyy-MM-dd"), []);
  });

  // STEP 3: Build the baseline schedule using the recurring rules.
  // We loop through each day and add any recurring slots that apply.
  for (const date of weekDates) {
    const dayOfWeek = getDay(date); // 0 for Sunday, 1 for Monday, etc.
    const dateString = format(date, "yyyy-MM-dd");
    const applicableSlots = allRecurringSlots.filter(
      (slot) => slot.day_of_week === dayOfWeek
    );
    if (applicableSlots.length > 0) {
      finalSchedule.set(dateString, applicableSlots);
    }
  }

  // STEP 4: Layer the exceptions on top of the baseline schedule.
  const exceptionsHandledForDate = new Set<string>();
  for (const exception of exceptions) {
    const dateString = format(new Date(exception.date), "yyyy-MM-dd");

    // This is the core override logic. The first time we see an exception for a date,
    // we completely WIPE any recurring slots we previously calculated for that day.
    if (!exceptionsHandledForDate.has(dateString)) {
      finalSchedule.set(dateString, []);
      exceptionsHandledForDate.add(dateString);
    }

    // Now, we handle the exception type.
    if (exception.type === "override") {
      // If it's an override, we add the new slot to the now-empty schedule.
      finalSchedule.get(dateString)?.push(exception);
    }
    // If it's a 'cancellation', we do nothing, leaving the schedule empty for that day.
  }

  // Convert our Map to a plain object for the JSON response and return it.
  return Object.fromEntries(finalSchedule);
};
// Add this function to the file
export const deleteScheduleException = async (exceptionId: number) => {
  const result = await pool.query(
    "DELETE FROM schedule_exceptions WHERE id = $1 RETURNING *;",
    [exceptionId]
  );
  if (result.rowCount === 0) {
    throw new Error("Exception not found or could not be deleted.");
  }
  return result.rows[0];
};
