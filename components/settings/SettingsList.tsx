type SettingsListItemProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
};

export function SettingsListItem({
  title,
  description,
  action,
  children,
}: SettingsListItemProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-base-200 p-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="font-medium">
          {title}
        </p>

        {description && (
          <p className="mt-1 text-sm text-base-content/60">
            {description}
          </p>
        )}

        {children}
      </div>

      {action}
    </div>
  );
}