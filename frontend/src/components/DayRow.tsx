import React from "react";
import Slot from "./Slot"; // Import Slot to be used as a child

interface DayRowProps {
  dayInfo: {
    fullDate: string;
    dayName: string;
    date: string;
    slots: any[];
  };
  isToday: boolean;
  onAddSlot: () => void;
  children: React.ReactNode;
}

export default function DayRow({
  dayInfo,
  isToday,
  children,
  onAddSlot,
}: DayRowProps) {
  const dayNameFormatted = new Date(dayInfo.fullDate).toLocaleDateString(
    "en-US",
    { weekday: "long" }
  );

  return (
    <div className="flex items-start p-4 border-b border-gray-200">
      {/* Date and Day Name on the left */}
      <div className="w-1/3">
        <p
          className={`font-semibold ${
            isToday ? "text-blue-600" : "text-gray-800"
          }`}
        >
          {dayNameFormatted}
        </p>
        <p className="text-sm text-gray-500">{dayInfo.date} September</p>
        {isToday && <p className="text-xs text-blue-600">(Today)</p>}
      </div>

      {/* Slots and Add button on the right */}
      <div className="w-2/3 flex flex-col items-center gap-2">
        {children}
        <button
          onClick={onAddSlot}
          className="w-full flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 hover:border-gray-400"
        >
          +
        </button>
      </div>
    </div>
  );
}
