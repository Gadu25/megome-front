type SettingsSectionHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function SettingsSectionHeader({
  title,
  description,
  action,
}: SettingsSectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-base-content/60">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}
