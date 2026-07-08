"use client";

type ApiPageHeaderProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function ApiPageHeader({
  title,
  description,
  action,
}: ApiPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>

        <p className="max-w-2xl text-sm text-base-content/70">
          {description}
        </p>
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}
