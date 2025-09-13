import { useState } from "react";

interface NewSlotFormProps {
  slotDate: string;
  onSave: (startTime: string, endTime: string) => void;
  onCancel: () => void;
}

export default function NewSlotForm({
  slotDate,
  onSave,
  onCancel,
}: NewSlotFormProps) {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In the next step, this will call our API. For now, it just logs the data.
    console.log({ date: slotDate, startTime, endTime });
    onSave(startTime, endTime);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Add New Slot</h2>
      <p className="mb-4 text-gray-600">
        Creating a slot for: <span className="font-bold">{slotDate}</span>
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
          Save Slot
        </button>
      </div>
    </form>
  );
}
