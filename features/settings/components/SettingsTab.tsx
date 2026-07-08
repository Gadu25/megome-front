import Link from "next/link";

type SettingsTab =
  | "account"
  | "api"
  | "data"
  | "security"
  | "output"
  | "integrations";

type SettingsTabsProps = {
  activeTab: SettingsTab;
};

const tabs = [
  { id: "account", label: "Account" },
  { id: "api", label: "API Keys" },
  { id: "data", label: "Portfolio Data" },
  { id: "output", label: "API Output" },
  { id: "security", label: "Security" },
  { id: "integrations", label: "Integrations" },
] as const;

export function SettingsTabs({
  activeTab,
}: SettingsTabsProps) {
  return (
    <>
      {/* Mobile */}
      <div
        role="tablist"
        className="flex gap-2 overflow-x-auto pb-1 lg:hidden"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/settings?tab=${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`btn btn-sm whitespace-nowrap ${
              activeTab === tab.id
                ? "btn-primary"
                : "btn-ghost"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Desktop */}
      <div
        role="tablist"
        className="hidden space-y-1 lg:flex lg:flex-col"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/settings?tab=${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`btn btn-sm justify-start ${
              activeTab === tab.id
                ? "btn-primary"
                : "btn-ghost"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </>
  );
}
