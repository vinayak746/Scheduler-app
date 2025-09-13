import React from "react";

interface DayColumnProps {
  dayInfo: { fullDate: string; dayName: string; date: string; slots: any[] };
  isCurrentDay: boolean;
  onAddSlot: () => void;
  children: React.ReactNode;
}

export default function DayColumn({
  dayInfo,
  isCurrentDay,
  onAddSlot,
  children,
}: DayColumnProps) {
  const dateCircleStyle = isCurrentDay
    ? "bg-blue-600 text-white"
    : "bg-transparent text-gray-700";

  return (
    <div className="border-r border-b border-gray-200 p-2 flex flex-col">
      <div className="flex flex-col items-center">
        <p className="text-xs font-medium text-gray-500">
          {dayInfo.dayName.toUpperCase()}
        </p>
        <div
          className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center ${dateCircleStyle}`}
        >
          <p className="text-base font-semibold">{dayInfo.date}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2 w-full flex-grow">{children}</div>
      <button
        onClick={onAddSlot}
        className="mt-4 w-full text-blue-600 hover:bg-blue-100 p-2 rounded-lg text-sm font-semibold flex items-center justify-center"
      >
        +
      </button>
    </div>
  );
}
