import pool from "./db";

const setupDatabase = async () => {
  try {
    console.log("Starting database setup...");

    // These lines will drop (delete) the tables if they already exist.
    await pool.query("DROP TABLE IF EXISTS schedule_exceptions;");
    await pool.query("DROP TABLE IF EXISTS recurring_schedules;");
    console.log("Existing tables dropped.");

    // This creates the table for recurring rules.
    await pool.query(`
      CREATE TABLE recurring_schedules (
        id SERIAL PRIMARY KEY,
        day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL
      );
    `);
    console.log('Table "recurring_schedules" created.');

    // This is the important part. This creates the exceptions table WITH THE 'TYPE' COLUMN.
    await pool.query(`
      CREATE TABLE schedule_exceptions (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        start_time TIME, -- Nullable
        end_time TIME, -- Nullable
        type VARCHAR(20) NOT NULL CHECK (type IN ('override', 'cancellation')) -- THIS LINE IS THE FIX
      );
    `);
    console.log('Table "schedule_exceptions" created.');

    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    // This makes sure the connection is closed after the script runs.
    await pool.end();
  }
};

setupDatabase();
