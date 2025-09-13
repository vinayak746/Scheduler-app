import React from "react";
import { format, parseISO } from "date-fns";

interface DayRowProps {
  dayInfo: { fullDate: string; slots: any[]; dayName: string; date: string };
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

  return (
    <div className={`flex items-start p-4 border-b border-gray-100 transition-colors ${
      isToday ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
    }`}>
      <div className="w-1/3 pr-4">
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-gray-500 mb-0.5">
              {dayInfo.dayName.substring(0, 3)}
            </span>
            <div 
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                isToday 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              {dayInfo.date}
            </div>
          </div>
          <div>
            <p className={`text-sm font-medium ${
              isToday ? 'text-blue-700' : 'text-gray-900'
            }`}>
              {format(parseISO(dayInfo.fullDate), 'MMMM d')}
            </p>
            {isToday && (
              <span className="inline-block mt-0.5 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                Today
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="w-2/3">
        <div className="space-y-2">
          {React.Children.count(children) > 0 ? (
            children
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-400">No time slots added</p>
            </div>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddSlot();
            }}
            className="w-full py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center space-x-1 border border-dashed border-gray-300 hover:border-blue-300"
          >
            <span>+</span>
            <span>Add time slot</span>
          </button>
        </div>
      </div>
    </div>
  );
}
