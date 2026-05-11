export function SectionCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="p-5 space-y-4">
        {children}
      </div>
    </div>
  );
}