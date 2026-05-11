export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6 border border-dashed border-base-300 rounded-xl bg-base-200/30">
      {icon && (
        <div className="mb-3 text-base-content/60">
          {icon}
        </div>
      )}

      <p className="text-sm text-base-content/70">
        {title}
      </p>

      {description && (
        <p className="text-xs text-base-content/50 mt-1">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}