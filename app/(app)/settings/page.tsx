import { Card } from "@/components/ui/Card";
import {
  SettingsTabs,
  AccountTab,
  ApiTab,
  DataTab,
  SecurityTab,
} from "@/features/settings";

type SettingsTab = "account" | "security" | "api" | "data";

type SettingsPageProps = {
  searchParams?: Promise<{ tab?: string }>;
};

const VALID_TABS: SettingsTab[] = ["account", "security", "api", "data"];

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;

  const activeTab: SettingsTab = VALID_TABS.includes(params?.tab as SettingsTab)
    ? (params?.tab as SettingsTab)
    : "account";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <aside className="lg:col-span-1">
        <Card variant="default" className="p-4 shadow-xs">
          <div className="px-2 pb-4">
            <h1 className="text-lg font-semibold">Settings</h1>
            <p className="text-sm text-base-content/60">
              Manage your account configuration.
            </p>
          </div>
          <SettingsTabs activeTab={activeTab} />
        </Card>
      </aside>

      <main className="space-y-6 lg:col-span-3">
        {activeTab === "account" && <AccountTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "api" && <ApiTab />}
        {activeTab === "data" && <DataTab />}
      </main>
    </div>
  );
}
