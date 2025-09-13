interface SlotProps {
  startTime: string;
  endTime: string;
}

export default function Slot({ startTime, endTime }: SlotProps) {
  return (
    <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 text-center cursor-pointer hover:bg-blue-200">
      <p className="text-xs font-semibold text-blue-800">
        {startTime} - {endTime}
      </p>
    </div>
  );
}
