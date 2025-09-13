import { useState, useEffect } from "react";
import {
  format,
  parseISO,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import DayColumn from "./DayColumn";
import Slot from "./Slot";
import { fetchWeeklySchedule } from "../services/scheduleApi";

// Define a type for our schedule data for better type safety
type ScheduleData = {
  [date: string]: any[]; // e.g., { '2025-09-13': [{ id: 1, ... }] }
};

export default function Calendar() {
  // State to hold the current date we are viewing
  const [currentDate, setCurrentDate] = useState(new Date());

  // State to hold the schedule data that comes back from the API
  const [schedule, setSchedule] = useState<ScheduleData>({});

  const goToPreviousWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  // NEW: Function to handle moving to the next week
  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };
  useEffect(() => {
    const getSchedule = async () => {
      console.log("Fetching schedule for:", currentDate);
      const data = await fetchWeeklySchedule(currentDate);
      setSchedule(data); // Update our state with the fetched data
    };

    getSchedule();
  }, [currentDate]); // The dependency array: this effect depends on 'currentDate'

  // Helper function to create the display data for our grid from the fetched schedule
  const generateWeekData = () => {
    return Object.entries(schedule).map(([dateString, slots]) => {
      const date = parseISO(dateString); // Convert '2025-09-13' string back to a Date object
      return {
        dayName: format(date, "EEE"), // 'Sun', 'Mon', etc.
        date: format(date, "d"), // '7', '8', etc.
        slots: slots,
      };
    });
  };

  const weekData = generateWeekData();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const headerTitle = `${format(weekStart, "MMM d")} - ${format(
    weekEnd,
    "d, yyyy"
  )}`;

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
      {/* ... Calendar Header remains the same for now ... */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousWeek}
          className="text-xl font-bold p-2 hover:bg-gray-100 rounded-full"
        >
          ‹
        </button>
        <h1 className="text-xl font-semibold">{headerTitle}</h1>
        <button
          onClick={goToNextWeek}
          className="text-xl font-bold p-2 hover:bg-gray-100 rounded-full"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 border-t border-l border-gray-200">
        {weekData.length > 0 ? (
          weekData.map((day) => (
            <DayColumn
              key={day.dayName}
              dayName={day.dayName}
              date={day.date}
              isCurrentDay={parseInt(day.date) === new Date().getDate()}
            >
              {day.slots.map((slot: any, index: number) => (
                // Use the time format from our database (e.g., "09:00:00")
                <Slot
                  key={index}
                  startTime={slot.start_time.slice(0, 5)}
                  endTime={slot.end_time.slice(0, 5)}
                />
              ))}
            </DayColumn>
          ))
        ) : (
          <p className="col-span-7 text-center p-8 text-gray-500">
            Loading schedule...
          </p>
        )}
      </div>
    </div>
  );
}
