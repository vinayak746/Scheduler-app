// src/components/Calendar.tsx
import { useState, useEffect, useCallback } from "react";
import {
  format,
  parseISO,
  addDays,
  subDays,
  getDay,
  setMonth,
  getYear,
} from "date-fns";
import DayRow from "./DayRow";
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
import { HamburgerIcon } from "./Icons";

type ScheduleData = { [date: string]: any[] };

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedule, setSchedule] = useState<ScheduleData>({});
  const [isMonthPickerOpen, setMonthPickerOpen] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    data: any;
  }>({ isOpen: false, mode: "add", data: null });

  const getSchedule = useCallback(async () => {
    setSchedule(await fetchWeeklySchedule(currentDate));
  }, [currentDate]);
  useEffect(() => {
    getSchedule();
  }, [getSchedule]);

  const goToPreviousWeek = () => setCurrentDate(subDays(currentDate, 7));
  const goToNextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const goToMonth = (monthIndex: number) => {
    setCurrentDate(setMonth(currentDate, monthIndex));
    setMonthPickerOpen(false);
  };

  const handleOpenAddModal = (dateString: string) =>
    setModalState({ isOpen: true, mode: "add", data: { date: dateString } });
  const handleOpenEditModal = (slot: any) =>
    setModalState({ isOpen: true, mode: "edit", data: slot });
  const handleCloseModal = () =>
    setModalState({ isOpen: false, mode: "add", data: null });

  const handleSaveSlot = async (startTime: string, endTime: string) => {
    try {
      if (modalState.mode === "edit") {
        await updateScheduleException(modalState.data.id, {
          start_time: startTime,
          end_time: endTime,
        });
      } else {
        await createScheduleException({
          date: modalState.data.date,
          start_time: startTime,
          end_time: endTime,
        });
      }
      handleCloseModal();
      await getSchedule();
    } catch (error) {
      alert("Error: Could not save the slot.");
    }
  };

  const handleDeleteSlot = async (slotId: number) => {
    if (window.confirm("Are you sure you want to delete this slot?")) {
      try {
        await deleteScheduleException(slotId);
        await getSchedule();
      } catch (error) {
        alert("Error: Could not delete the slot.");
      }
    }
  };

  const weekData = Object.entries(schedule).map(([dateString, slots]) => {
    const date = parseISO(dateString);
    return {
      fullDate: dateString,
      dayName: format(date, "EEE"),
      date: format(date, "d"),
      dayOfWeek: getDay(date),
      slots: slots,
    };
  });

  const months = Array.from({ length: 12 }, (_, i) =>
    format(new Date(0, i), "MMMM")
  );
  const headerTitle = format(currentDate, "MMMM yyyy");
  const todayDate = format(new Date(), "yyyy-MM-dd");
  const weekDayAbbrs = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="w-full max-w-md mx-auto bg-white flex flex-col md:max-w-7xl md:rounded-lg md:shadow-lg md:my-8">
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <button className="text-gray-500 md:hidden">
            <HamburgerIcon />
          </button>
          <div className="relative text-center md:text-left">
            <h1 className="text-lg font-bold text-gray-800 hidden md:block">
              Your Schedule
            </h1>
            <h2
              className="font-semibold text-gray-500 text-sm cursor-pointer"
              onClick={() => setMonthPickerOpen(!isMonthPickerOpen)}
            >
              {headerTitle} <span>⌄</span>
            </h2>
            {isMonthPickerOpen && (
              <div className="absolute top-full mt-2 bg-white shadow-lg rounded-md p-2 z-10 w-48">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => goToMonth(index)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
                  >
                    {month} {getYear(currentDate)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              ‹
            </button>
            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              ›
            </button>
          </div>
          <button className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-md">
            Save
          </button>
        </header>
        {/* --- MOBILE VIEW --- */}
        <div className="md:hidden">
          <div className="p-4 bg-white grid grid-cols-7 gap-1 text-center">
            {weekData.map((day) => (
              <div
                key={day.fullDate}
                className={`p-2 rounded-lg ${
                  day.fullDate === todayDate
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                <span className="text-xs font-semibold">
                  {weekDayAbbrs[day.dayOfWeek]}
                </span>
                <span className="mt-1 block font-bold">{day.date}</span>
              </div>
            ))}
          </div>
          <main className="flex-grow overflow-y-auto bg-white">
            {weekData.map((day) => (
              <DayRow
                key={day.fullDate}
                dayInfo={day}
                isToday={day.fullDate === todayDate}
                onAddSlot={() => handleOpenAddModal(day.fullDate)}
              >
                {day.slots.map((slot) => (
                  <Slot
                    key={slot.id || `${slot.start_time}`}
                    slot={slot}
                    onDelete={handleDeleteSlot}
                    onEdit={handleOpenEditModal}
                  />
                ))}
              </DayRow>
            ))}
          </main>
        </div>
        {/* --- DESKTOP VIEW --- */}

        <div className="hidden md:grid grid-cols-7 bg-gray-50 border-t border-gray-200">
          {" "}
          {/* <--- ADD bg-gray-50 AND BORDERS HERE */}
          {weekData.map((day) => (
            <DayColumn
              key={day.fullDate}
              dayInfo={day}
              isCurrentDay={day.fullDate === todayDate}
              onAddSlot={() => handleOpenAddModal(day.fullDate)}
            >
              {day.slots.map((slot) => (
                <Slot
                  key={slot.id || `${slot.start_time}`}
                  slot={slot}
                  onDelete={handleDeleteSlot}
                  onEdit={handleOpenEditModal}
                />
              ))}
            </DayColumn>
          ))}
        </div>
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
