"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bars3Icon } from "@heroicons/react/24/outline";

interface SortableItemProps {
  id: number;
  title: string;
  subtitle?: string;
}

export default function SortableItem({ id, title, subtitle }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border border-base-300 bg-base-100 px-4 py-3 transition-shadow ${
        isDragging ? "shadow-lg" : "hover:shadow-sm"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-base-content/40 hover:text-base-content/70 active:cursor-grabbing"
      >
        <Bars3Icon className="size-5" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title || "Untitled"}</p>
        {subtitle && (
          <p className="truncate text-xs text-base-content/60">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
