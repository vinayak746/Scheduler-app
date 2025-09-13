import { useState, useEffect, useCallback } from "react"; // Add useCallback
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
// Import our new create function
import {
  fetchWeeklySchedule,
  createScheduleException,
  deleteScheduleException,
} from "../services/scheduleApi";
import Modal from "./Model"; // Make sure this filename matches yours (Modal.tsx)
import NewSlotForm from "./NewSlotForm";

type ScheduleData = {
  [date: string]: any[];
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedule, setSchedule] = useState<ScheduleData>({});
  const [modalState, setModalState] = useState({
    isOpen: false,
    selectedDate: "",
  });

  // REFACTORED: We've pulled the data fetching logic into its own function.
  // We wrap it in useCallback to prevent it from being recreated on every render.
  const getSchedule = useCallback(async () => {
    console.log("Fetching schedule for:", currentDate);
    const data = await fetchWeeklySchedule(currentDate);
    setSchedule(data);
  }, [currentDate]); // This function depends on 'currentDate'

  // useEffect now simply calls our stable getSchedule function.
  useEffect(() => {
    getSchedule();
  }, [getSchedule]); // The effect now depends on the getSchedule function itself.

  const goToPreviousWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const handleAddSlot = (dateString: string) => {
    setModalState({ isOpen: true, selectedDate: dateString });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, selectedDate: "" });
  };

  // UPDATED: This function is now async and calls our API
  const handleSaveSlot = async (startTime: string, endTime: string) => {
    try {
      await createScheduleException({
        date: modalState.selectedDate,
        start_time: startTime,
        end_time: endTime,
      });

      console.log("Slot saved successfully!");
      handleCloseModal();

      // After saving, we call getSchedule() again to refresh the data on the screen.
      // This is the key to making the UI update automatically.
      await getSchedule();
    } catch (error) {
      console.error("Failed to save the slot.", error);
      // Here you could add state to show an error message to the user
      alert(
        "Error: Could not save the slot. Please check the console for details."
      );
    }
  };
  const handleDeleteSlot = async (slotId: number) => {
    // Ask for confirmation before deleting
    if (window.confirm("Are you sure you want to delete this slot?")) {
      try {
        await deleteScheduleException(slotId);
        console.log("Slot deleted successfully!");
        // Refresh the schedule to show the slot has been removed
        await getSchedule();
      } catch (error) {
        console.error("Failed to delete the slot.", error);
        alert("Error: Could not delete the slot.");
      }
    }
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  // IMPROVED: We now add the full date string to our data for more robust keys and checks
  const weekData = Object.entries(schedule).map(([dateString, slots]) => {
    const date = parseISO(dateString);
    return {
      fullDate: dateString, // e.g., '2025-09-13'
      dayName: format(date, "EEE"),
      date: format(date, "d"),
      slots: slots,
    };
  });
  const headerTitle = `${format(weekStart, "MMM d")} - ${format(
    endOfWeek(currentDate, { weekStartsOn: 0 }),
    "d, yyyy"
  )}`;

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
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
              key={day.fullDate} // IMPROVED: Use a guaranteed unique key
              dayName={day.dayName}
              date={day.date}
              // IMPROVED: More robust check for the current day
              isCurrentDay={day.fullDate === format(new Date(), "yyyy-MM-dd")}
              onAddSlot={() => handleAddSlot(day.fullDate)}
            >
              {day.slots.map((slot: any, index: number) => (
                <Slot
                  key={slot.id || index} // Use slot.id if it exists, for a more stable key
                  id={slot.id} // Pass the slot's ID
                  startTime={slot.start_time.slice(0, 5)}
                  endTime={slot.end_time.slice(0, 5)}
                  onDelete={handleDeleteSlot} // Pass the delete handler function
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
      <Modal isOpen={modalState.isOpen} onClose={handleCloseModal}>
        <NewSlotForm
          slotDate={modalState.selectedDate}
          onSave={handleSaveSlot}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
