import pool from "./db";

const setupDatabase = async () => {
  try {
    console.log("Starting database setup...");

    // Drop tables if they exist to start fresh
    await pool.query("DROP TABLE IF EXISTS schedule_exceptions;");
    await pool.query("DROP TABLE IF EXISTS recurring_schedules;");
    console.log("Existing tables dropped.");

    // Create recurring_schedules table
    // day_of_week: 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    await pool.query(`
      CREATE TABLE recurring_schedules (
        id SERIAL PRIMARY KEY,
        day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL
      );
    `);
    console.log('Table "recurring_schedules" created.');

    // Create schedule_exceptions table
    // This table overrides the recurring schedule for a specific date.
    await pool.query(`
      CREATE TABLE schedule_exceptions (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL
      );
    `);
    console.log('Table "schedule_exceptions" created.');

    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    // End the pool connection
    await pool.end();
  }
};

setupDatabase();
