import pool from "../db";

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
