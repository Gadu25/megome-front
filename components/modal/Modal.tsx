"use client"
import { useEffect, useRef } from 'react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void

  title?: string
  children?: React.ReactNode

  onAccept?: () => void
  onCancel?: () => void

  acceptText?: string
  cancelText?: string
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  onAccept,
  onCancel,
  acceptText = 'Accept',
  cancelText = 'Cancel',
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      className="modal modal-bottom sm:modal-middle"
      onClose={onClose}
    >
      <div className="modal-box">
        {title && <h3 className="text-lg font-bold">{title}</h3>}

        <div className="py-4">{children}</div>

        {(onAccept || onCancel) && (
          <div className="modal-action">
            {onCancel && (
              <button
                className="btn"
                onClick={() => {
                  onCancel()
                  onClose()
                }}
              >
                {cancelText}
              </button>
            )}
            {onAccept && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  onAccept()
                  onClose()
                }}
              >
                {acceptText}
              </button>
            )}
          </div>
        )}
      </div>
    </dialog>
  )
}