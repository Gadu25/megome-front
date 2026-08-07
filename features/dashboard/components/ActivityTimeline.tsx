import type { ActivityItem } from "@/types/api";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-base-300">
        <p className="text-sm text-base-content/60">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div
          key={`${item.type}-${item.id}`}
          className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-base-200/50 transition-colors"
        >
          <span className="badge badge-sm badge-ghost capitalize">{item.type}</span>
          <span className="text-sm flex-1 truncate">{item.name}</span>
          <span className="text-xs text-base-content/40 whitespace-nowrap">
            {timeAgo(item.createdAt)}
          </span>
        </div>
      ))}
    </div>
  );
}
