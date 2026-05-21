type SettingsInfoBoxProps = {
  children: React.ReactNode;
  className?: string;
};

export function SettingsInfoBox({
  children,
  className = "",
}: SettingsInfoBoxProps) {
  return (
    <div
      className={`rounded-2xl border border-base-200 bg-base-50 p-4 ${className}`}
    >
      {children}
    </div>
  );
}