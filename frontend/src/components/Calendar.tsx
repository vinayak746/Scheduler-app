import { useState, useEffect, useCallback } from "react";
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
import {
  fetchWeeklySchedule,
  createScheduleException,
  deleteScheduleException,
  updateScheduleException,
} from "../services/scheduleApi";
import Modal from "./Model";
import NewSlotForm from "./NewSlotForm";

type ScheduleData = {
  [date: string]: any[];
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedule, setSchedule] = useState<ScheduleData>({});

  // This state now tracks if the modal is open, its mode ('add' or 'edit'), and the data it needs.
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    data: any;
  }>({ isOpen: false, mode: "add", data: null });

  const getSchedule = useCallback(async () => {
    const data = await fetchWeeklySchedule(currentDate);
    setSchedule(data);
  }, [currentDate]);

  useEffect(() => {
    getSchedule();
  }, [getSchedule]);

  const goToPreviousWeek = () => setCurrentDate(subDays(currentDate, 7));
  const goToNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  const handleOpenAddModal = (dateString: string) => {
    setModalState({ isOpen: true, mode: "add", data: { date: dateString } });
  };

  const handleOpenEditModal = (slot: any) => {
    setModalState({ isOpen: true, mode: "edit", data: slot });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: "add", data: null });
  };

  // This one function now handles both creating AND updating slots.
  const handleSaveSlot = async (startTime: string, endTime: string) => {
    try {
      if (modalState.mode === "edit") {
        // If we are editing, call the update API function
        await updateScheduleException(modalState.data.id, {
          start_time: startTime,
          end_time: endTime,
        });
      } else {
        // If we are adding, call the create API function
        await createScheduleException({
          date: modalState.data.date,
          start_time: startTime,
          end_time: endTime,
        });
      }
      handleCloseModal();
      await getSchedule(); // Refresh data on the screen
    } catch (error) {
      alert("Error: Could not save the slot. See console for details.");
      console.error(error);
    }
  };

  const handleDeleteSlot = async (slotId: number) => {
    if (window.confirm("Are you sure you want to delete this slot?")) {
      try {
        await deleteScheduleException(slotId);
        await getSchedule(); // Refresh data
      } catch (error) {
        alert("Error: Could not delete the slot.");
      }
    }
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekData = Object.entries(schedule).map(([dateString, slots]) => {
    const date = parseISO(dateString);
    return {
      fullDate: dateString,
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
        {weekData.map((day) => (
          <DayColumn
            key={day.fullDate}
            dayName={day.dayName}
            date={day.date}
            isCurrentDay={day.fullDate === format(new Date(), "yyyy-MM-dd")}
            onAddSlot={() => handleOpenAddModal(day.fullDate)}
          >
            {day.slots.map((slot: any) => (
              <Slot
                key={slot.id || `${slot.start_time}-${slot.end_time}`}
                slot={slot}
                onDelete={handleDeleteSlot}
                onEdit={handleOpenEditModal}
              />
            ))}
          </DayColumn>
        ))}
      </div>
      <Modal isOpen={modalState.isOpen} onClose={handleCloseModal}>
        <NewSlotForm
          slotDate={modalState.data?.date?.slice(0, 10) || ""}
          initialData={
            modalState.mode === "edit"
              ? {
                  startTime: modalState.data.start_time,
                  endTime: modalState.data.end_time,
                }
              : undefined
          }
          onSave={handleSaveSlot}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
