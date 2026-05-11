type SettingsCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function SettingsCard({
  children,
  className = "",
}: SettingsCardProps) {
  return (
    <section
      className={`card border border-base-200 bg-base-100 shadow-sm ${className}`}
    >
      <div className="card-body space-y-6">
        {children}
      </div>
    </section>
  );
}