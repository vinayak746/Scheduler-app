import { TrashIcon } from "./Icons";

interface SlotProps {
  slot: any;
  onDelete: (id: number) => void;
  onEdit: (slot: any) => void;
}

export default function Slot({ slot, onDelete, onEdit }: SlotProps) {
  const isEditable = slot.id !== undefined && slot.id !== null;
  const startTime = slot.start_time.slice(0, 5);
  const endTime = slot.end_time.slice(0, 5);

  return (
    <div className="flex items-center justify-between w-full gap-2">
      <button
        onClick={() => isEditable && onEdit(slot)}
        disabled={!isEditable}
        className="flex-grow bg-gray-100 border border-gray-300 rounded-md p-2 text-center text-sm text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-200"
      >
        {startTime} - {endTime}
      </button>

      {isEditable && (
        <button
          onClick={() => onDelete(slot.id)}
          className="p-2 text-gray-400 hover:text-red-500"
          title="Delete slot"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}
