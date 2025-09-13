import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  // If the modal isn't open, render nothing.
  if (!isOpen) return null;

  return (
    // Main overlay: fixed position, covers the whole screen, with a semi-transparent black background.
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose} // Clicking the background will close the modal
    >
      {/* Modal content container: stops the click from closing the modal (e.stopPropagation) */}
      <div
        className="bg-white rounded-lg shadow-xl p-6 relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* The actual content of the modal will be passed in as 'children' */}
        {children}
      </div>
    </div>
  );
}
