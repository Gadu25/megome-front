import { PencilSquareIcon } from "@heroicons/react/24/outline";

export function SectionHeader({
  title,
  onEdit,
  rightElement,
}: {
  title: string;
  onEdit?: () => void;
  rightElement?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-semibold text-base">
        {title}
      </h2>

      <div className="flex items-center gap-2">
        {rightElement}

        {onEdit && (
          <button
            className="btn btn-xs"
            onClick={onEdit}
          >
            <PencilSquareIcon className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
}