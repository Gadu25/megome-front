"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { reorderClient } from "@/lib/api/client/reorder";

import SortableItem from "./SortableItem";

interface ReorderTabProps {
  resource: "experience" | "certification" | "education" | "project";
  items: Array<{ id: number; title: string; subtitle?: string }>;
  onReordered?: () => void;
}

export default function ReorderTab({ resource, items: initialItems, onReordered }: ReorderTabProps) {
  const [items, setItems] = useState(initialItems);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    const reorderPayload = newItems.map((item, index) => ({
      id: item.id,
      displayOrder: index + 1,
    }));

    setSaving(true);
    try {
      await reorderClient(resource, reorderPayload);
      onReordered?.();
    } catch (error) {
      console.error("Failed to save order:", error);
      setItems(items);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {saving && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-base-200 px-3 py-1.5 text-xs text-base-content/70">
          Saving...
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                title={item.title}
                subtitle={item.subtitle}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {items.length === 0 && (
        <div className="py-12 text-center text-sm text-base-content/50">
          No items to reorder
        </div>
      )}
    </div>
  );
}
