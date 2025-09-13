import { useState, useEffect } from "react";

interface NewSlotFormProps {
  slotDate: string;
  initialData?: { startTime: string; endTime: string }; // Optional initial data for editing
  onSave: (startTime: string, endTime: string) => void;
  onCancel: () => void;
}

export default function NewSlotForm({
  slotDate,
  initialData,
  onSave,
  onCancel,
}: NewSlotFormProps) {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  // We check if initialData exists to determine if we're in "edit" mode.
  const isEditMode = !!initialData;

  useEffect(() => {
    // This effect runs when the component loads.
    // If we are in "edit" mode, it pre-fills the form fields with the existing slot's data.
    if (initialData) {
      setStartTime(initialData.startTime.slice(0, 5));
      setEndTime(initialData.endTime.slice(0, 5));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(startTime, endTime);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">
        {isEditMode ? "Edit Slot" : "Add New Slot"}
      </h2>
      <p className="mb-4 text-gray-600">
        For: <span className="font-bold">{slotDate}</span>
      </p>

      <div className="mb-4">
        <label
          htmlFor="start_time"
          className="block text-sm font-medium text-gray-700"
        >
          Start Time
        </label>
        <input
          type="time"
          id="start_time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="end_time"
          className="block text-sm font-medium text-gray-700"
        >
          End Time
        </label>
        <input
          type="time"
          id="end_time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
        >
          {isEditMode ? "Update Slot" : "Save Slot"}
        </button>
      </div>
    </form>
  );
}
