type FeatureInProgressOverlayProps = {
  title?: string;
  description?: string;
};

export function FeatureInProgressOverlay({
  title = "Coming Soon",
  description = "This feature is currently under development.",
}: FeatureInProgressOverlayProps) {
  return (
    <div
      className="
        border
        border-base-300
        absolute inset-0 z-20
        flex items-center justify-center
        rounded-2xl
        bg-base-100/40
        backdrop-blur-sm
        transition-all duration-300
        hover:bg-base-100/70
        hover:backdrop-blur-xs
      "
    >
      <div className="text-center px-4">
        <div className="badge badge-warning mb-3">
          In Progress
        </div>

        <h3 className="text-lg font-semibold">
          {title}
        </h3>

        <p className="mt-2 text-sm text-base-content/70 max-w-xs">
          {description}
        </p>
      </div>
    </div>
  );
}
