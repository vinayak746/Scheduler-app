import React from "react";

interface DayColumnProps {
  dayName: string;
  date: string;
  isCurrentDay?: boolean;
  children?: React.ReactNode;
}

export default function DayColumn({
  dayName,
  date,
  isCurrentDay = false,
  children,
}: DayColumnProps) {
  const dateCircleStyle = isCurrentDay
    ? "bg-blue-600 text-white"
    : "bg-transparent text-gray-700";

  return (
    // NEW: Added flex, flex-col, and a minimum height. This is the key to consistent column height.
    <div className="border-r border-b border-gray-200 p-2 flex flex-col">
      <div className="flex flex-col items-center">
        {/* Day Name (e.g., SUN) */}
        <p className="text-xs font-medium text-gray-500">
          {dayName.toUpperCase()}
        </p>

        {/* Date Number (e.g., 7) */}
        <div
          className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center ${dateCircleStyle}`}
        >
          <p className="text-base font-semibold">{date}</p>
        </div>
      </div>

      {/* This is where the Slot components will be rendered */}
      {/* NEW: Added 'flex-grow'. This makes this div expand to fill all available space,
          pushing the button below it to the bottom of the column. */}
      <div className="mt-4 space-y-2 w-full flex-grow">{children}</div>

      {/* "Add Slot" button placeholder */}
      <button className="mt-4 w-full text-blue-600 hover:bg-blue-100 p-2 rounded-lg text-sm font-semibold flex items-center justify-center">
        +
      </button>
    </div>
  );
}
