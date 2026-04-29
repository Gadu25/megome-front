"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";

interface RightModalProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function RightModal({ isOpen, onClose, title, children }: RightModalProps) {
  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/90 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        className={`
          absolute right-0 top-0 h-screen w-full max-w-[700px]
          bg-base-100 shadow-xl
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between p-4 items-center">
          <h2 className="font-semibold text-2xl">{ title }</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
          {children}
        </div>
      </div>
    </div>
  );
}