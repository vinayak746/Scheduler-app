import { format } from "date-fns";

// The base URL of our backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      `${API_BASE_URL}/schedules?date=${dateString}`,
      {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    console.error("Failed to fetch weekly schedule:", error);
    const errorMessage = (error as Error).message || 'Unknown error';
    const errorName = (error as Error).name || 'Error';
    
    if (errorName === 'AbortError') {
      throw new Error('Request timed out. The server is taking too long to respond.');
    } else if (!navigator.onLine) {
      throw new Error('You are offline. Please check your internet connection.');
    } else if (errorMessage.includes('Failed to fetch')) {
      throw new Error('Failed to connect to the server. Please make sure the backend is running.');
    } else {
      throw new Error(`Failed to load schedule: ${errorMessage}`);
    }
  }
}
export interface ScheduleExceptionBase {
  start_time: string;
  end_time: string;
  notes?: string;
}

export interface CreateScheduleExceptionData extends ScheduleExceptionBase {
  date: string;
}

export async function createScheduleException(slotData: CreateScheduleExceptionData) {
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

export async function updateScheduleException(
  id: number,
  slotData: ScheduleExceptionBase
) {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules/exceptions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slotData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update schedule exception");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to update schedule exception:", error);
    throw error;
  }
}
