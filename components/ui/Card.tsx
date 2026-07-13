type CardVariant = "default" | "glass" | "interactive";

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
}

export function Card({
  children,
  variant = "default",
  className = "",
}: CardProps) {
  const base =
    "rounded-2xl bg-base-100 border border-base-200/90";

  const variants = {
    default: "",
    glass:
      "bg-base-100/60 backdrop-blur-md border-white/10",
    interactive:
      "transition hover:bg-base-200/40 cursor-pointer",
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`}>
      <div>{children}</div>
    </div>
  );
}
