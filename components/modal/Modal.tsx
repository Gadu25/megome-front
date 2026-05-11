"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;

  title?: string;
  children?: React.ReactNode;

  onAccept?: () => void;
  onCancel?: () => void;

  acceptText?: string;
  cancelText?: string;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  onAccept,
  onCancel,
  acceptText = "Accept",
  cancelText = "Cancel",
}: ModalProps) {
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  // handle open/close lifecycle
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isOpen) {
      setMounted(true);

      // allow DOM paint first
      requestAnimationFrame(() => {
        setVisible(true);
      });
    } else {
      setVisible(false);

      timeout = setTimeout(() => {
        setMounted(false);
      }, 200); // match animation duration
    }

    return () => clearTimeout(timeout);
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-md rounded-box bg-base-100 p-5 shadow-xl
          transform transition-all duration-200 ease-out
          ${
            visible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }
        `}
      >
        {title && (
          <h3 className="text-lg font-bold">{title}</h3>
        )}

        <div className="py-4">{children}</div>

        {(onAccept || onCancel) && (
          <div className="modal-action">
            {onCancel && (
              <button
                className="btn"
                onClick={() => {
                  onCancel();
                  onClose();
                }}
              >
                {cancelText}
              </button>
            )}

            {onAccept && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
              >
                {acceptText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}