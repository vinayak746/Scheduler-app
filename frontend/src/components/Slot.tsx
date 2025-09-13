interface SlotProps {
  slot: any;
  onDelete: (id: number) => void;
  onEdit: (slot: any) => void;
}

// A simple SVG icon for the trash can
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export default function Slot({ slot, onDelete, onEdit }: SlotProps) {
  const isEditable = slot.id !== undefined && slot.id !== null;
  const startTime = slot.start_time.slice(0, 5);
  const endTime = slot.end_time.slice(0, 5);

  // --- This is the new design from the mobile mockup ---
  return (
    <div className="flex items-center justify-between w-full">
      <div
        onClick={() => isEditable && onEdit(slot)}
        className={`flex-grow border rounded-md p-2 text-center text-sm ${
          isEditable
            ? "cursor-pointer hover:bg-gray-100"
            : "cursor-default bg-gray-100 text-gray-400"
        }`}
      >
        {startTime} - {endTime}
      </div>
      {isEditable && (
        <button
          onClick={() => onDelete(slot.id)}
          className="p-2 text-gray-400 hover:text-red-500"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}
