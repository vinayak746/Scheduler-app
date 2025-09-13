// src/components/Calendar.tsx
import { useState, useEffect, useCallback } from "react";
import {
  format,
  parseISO,
  addDays,
  subDays,
  getDay,
  setMonth,
} from "date-fns";
import DayRow from "./DayRow";
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
      <div className="w-full max-w-7xl mx-auto bg-white flex flex-col rounded-lg shadow-lg my-8 overflow-hidden">
        <header className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 md:hidden">
              <HamburgerIcon />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 hidden md:block">
              Your Schedule
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setMonthPickerOpen(!isMonthPickerOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-700 font-medium">{headerTitle}</span>
                <span className="text-gray-500">⌄</span>
              </button>
              {isMonthPickerOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white shadow-xl rounded-lg p-3 z-20 border border-gray-200">
                  <div className="grid grid-cols-3 gap-2">
                    {months.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => goToMonth(index)}
                        className={`px-3 py-2 text-sm rounded-md transition-colors ${
                          format(currentDate, 'MMMM') === month
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {month.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={goToPreviousWeek}
                className="p-2 text-gray-600 hover:bg-white hover:text-gray-900 rounded-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="px-2 text-sm text-gray-600">Week</span>
              <button
                onClick={goToNextWeek}
                className="p-2 text-gray-600 hover:bg-white hover:text-gray-900 rounded-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <button 
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => handleOpenAddModal(format(new Date(), 'yyyy-MM-dd'))}
            >
              + New Slot
            </button>
          </div>
        </header>
        {/* --- MOBILE VIEW --- */}
        <div className="md:hidden">
          <div className="p-3 bg-white border-b border-gray-100">
            <div className="grid grid-cols-7 gap-1">
              {weekData.map((day) => {
                const isToday = day.fullDate === todayDate;
                return (
                  <div key={day.fullDate} className="flex flex-col items-center">
                    <span className="text-xs font-medium text-gray-500 mb-1">
                      {weekDayAbbrs[day.dayOfWeek]}
                    </span>
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        isToday 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {day.date}
                    </div>
                  </div>
                );
              })}
            </div>
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
        <div className="hidden md:block">
          <div className="grid grid-cols-7 border-t border-gray-200">
            {weekData.map((day) => {
              const date = new Date(day.fullDate);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              
              return (
                <div 
                  key={day.fullDate} 
                  className={`flex flex-col ${isWeekend ? 'bg-gray-50' : 'bg-white'} border-r border-gray-100 last:border-r-0`}
                >
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-500 font-medium">
                        {day.dayName.toUpperCase()}
                      </span>
                      <span 
                        className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          day.fullDate === todayDate 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {day.date}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-2 overflow-y-auto max-h-[calc(100vh-200px)]">
                    <div className="space-y-2">
                      {day.slots.length > 0 ? (
                        day.slots.map((slot) => (
                          <Slot
                            key={slot.id || `${slot.start_time}`}
                            slot={slot}
                            onDelete={handleDeleteSlot}
                            onEdit={handleOpenEditModal}
                          />
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-400">No slots</p>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleOpenAddModal(day.fullDate)}
                      className="mt-2 w-full py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>+</span>
                      <span>Add slot</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
