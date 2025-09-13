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
export async function createScheduleException(slotData: {
  date: string;
  start_time: string;
  end_time: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules/exceptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Convert the JavaScript object to a JSON string for the request body
      body: JSON.stringify(slotData),
    });

    if (!response.ok) {
      // If the server responds with an error, we throw an error
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create schedule exception");
    }

    // Return the data from the successful response
    return await response.json();
  } catch (error) {
    console.error("Failed to create schedule exception:", error);
    // Re-throw the error so the component can handle it (e.g., show an error message)
    throw error;
  }
}

export async function deleteScheduleException(exceptionId: number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/schedules/exceptions/${exceptionId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete schedule exception");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to delete schedule exception:", error);
    throw error;
  }
}
