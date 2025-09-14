import { TrashIcon, PencilIcon } from "./Icons";
import React, { useState } from "react";
import toast from 'react-hot-toast';

interface SlotProps {
  slot: any;
  onDelete: (id: number) => void;
  onEdit: (slot: any) => void;
}

export default function Slot({ slot, onDelete, onEdit }: SlotProps) {
  const isEditable = slot.id !== undefined && slot.id !== null;
  const startTime = slot.start_time ? slot.start_time.slice(0, 5) : "";
  const endTime = slot.end_time ? slot.end_time.slice(0, 5) : "";

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditable) onEdit(slot);
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditable || isDeleting) return;
    
    try {
      setIsDeleting(true);
      await onDelete(slot.id);
    } catch (error) {
      console.error('Error deleting slot:', error);
      toast.error('Failed to delete slot');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-xl border border-gray-100 p-3 transition-all duration-200 ${
        !isEditable
          ? "opacity-75"
          : "hover:shadow-md hover:border-blue-100 cursor-pointer"
      }`}
      onClick={isEditable ? () => onEdit(slot) : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center h-7 px-2.5 rounded-md bg-blue-50 text-blue-700 text-sm font-medium">
              {startTime} - {endTime}
            </div>
          </div>

          {slot.notes && (
            <p className="mt-1.5 text-sm text-gray-600 line-clamp-2 leading-tight">
              {slot.notes}
            </p>
          )}
        </div>

        {isEditable && (
          <div className="flex space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50"
              title="Edit slot"
              aria-label="Edit time slot"
            >
              <PencilIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`p-1.5 rounded-lg transition-colors ${
                isDeleting 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
              title={isDeleting ? 'Deleting...' : 'Delete slot'}
              aria-label={isDeleting ? 'Deleting time slot' : 'Delete time slot'}
            >
              {isDeleting ? (
                <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              ) : (
                <TrashIcon className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
