"use client";

import { useState, useRef, useEffect } from "react";
import Modal from "@/components/ui/modal/Modal";

interface Props {
  open: boolean;
  file: File | null;
  onClose: () => void;
  onCrop: (blob: Blob) => void;
}

export default function AvatarCropModal({ open, file, onClose, onCrop }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const SIZE = 200;

  useEffect(() => {
    if (!file || !open) return;
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = URL.createObjectURL(file);
  }, [file, open]);

  const handleCrop = () => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = SIZE;
    canvas.height = SIZE;
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    const scale = SIZE / 200;
    ctx.drawImage(image, position.x * scale, position.y * scale, image.width * scale, image.height * scale);
    canvas.toBlob((blob) => {
      if (blob) onCrop(blob);
    }, "image/jpeg", 0.9);
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Crop Avatar" onAccept={handleCrop} acceptText="Crop">
      <div className="flex flex-col items-center gap-4">
        {image && (
          <div
            className="relative w-[200px] h-[200px] overflow-hidden rounded-full border-2 border-base-300 cursor-move"
            onMouseDown={(e) => {
              const startX = e.clientX - position.x;
              const startY = e.clientY - position.y;
              const onMove = (ev: MouseEvent) => {
                setPosition({ x: ev.clientX - startX, y: ev.clientY - startY });
              };
              const onUp = () => {
                document.removeEventListener("mousemove", onMove);
                document.removeEventListener("mouseup", onUp);
              };
              document.addEventListener("mousemove", onMove);
              document.addEventListener("mouseup", onUp);
            }}
          >
            <img
              src={image.src}
              alt="Crop preview"
              className="absolute max-w-none select-none"
              style={{ left: position.x, top: position.y, width: image.width }}
              draggable={false}
            />
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
        <p className="text-xs text-base-content/50">Drag to position your avatar</p>
      </div>
    </Modal>
  );
}
