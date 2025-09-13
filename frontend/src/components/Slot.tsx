interface SlotProps {
  slot: any; // Pass the whole slot object
  onDelete: (id: number) => void;
  onEdit: (slot: any) => void; // Function to handle editing
}

export default function Slot({ slot, onDelete, onEdit }: SlotProps) {
  // An exception/one-off slot will have a unique ID. A recurring one will not.
  const isEditable = slot.id !== undefined && slot.id !== null;

  return (
    <div
      onClick={() => isEditable && onEdit(slot)} // Make the whole div clickable for editing
      className={`relative bg-blue-100 border border-blue-300 rounded-lg p-2 text-center group ${
        isEditable ? "cursor-pointer hover:bg-blue-200" : "cursor-default"
      }`}
    >
      <p className="text-xs font-semibold text-blue-800">
        {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
      </p>
      {isEditable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(slot.id);
          }} // Stop click from bubbling up to the edit handler
          className="absolute top-0 right-0 p-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete slot"
        >
          &times;
        </button>
      )}
    </div>
  );
}
