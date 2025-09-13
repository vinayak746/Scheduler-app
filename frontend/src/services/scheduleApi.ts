import { format } from "date-fns";

// The base URL of our backend API
const API_BASE_URL = "http://localhost:3001";

/**
 * Fetches the weekly schedule from the backend for a given date.
 * @param date The date for which to fetch the week's schedule.
 * @returns The schedule data object from the API.
 */
export async function fetchWeeklySchedule(date: Date) {
  // Format the date into YYYY-MM-DD for the API query parameter
  const dateString = format(date, "yyyy-MM-dd");

  try {
    const response = await fetch(
      `${API_BASE_URL}/schedules?date=${dateString}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch weekly schedule:", error);
    // Return an empty object in case of an error so the UI doesn't crash
    return {};
  }
}
