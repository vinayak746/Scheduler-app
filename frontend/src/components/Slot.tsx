interface SlotProps {
  id: number; // The unique ID of the slot
  startTime: string;
  endTime: string;
  onDelete: (id: number) => void; // A function to call when delete is clicked
}

export default function Slot({ id, startTime, endTime, onDelete }: SlotProps) {
  // We only want to show the delete button if it's an exception (which will have an id)
  const isDeletable = id !== undefined && id !== null;

  return (
    <div className="relative bg-blue-100 border border-blue-300 rounded-lg p-2 text-center group hover:bg-blue-200">
      <p className="text-xs font-semibold text-blue-800">
        {startTime} - {endTime}
      </p>
      {isDeletable && (
        <button
          onClick={() => onDelete(id)}
          className="absolute top-0 right-0 p-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete slot"
        >
          &times; {/* This is a nice 'x' character */}
        </button>
      )}
    </div>
  );
}
