import { Card } from "@/components/ui/Card";
import {
  SettingsTabs,
  AccountTab,
  ApiTab,
  IntegrationsTab,
  OutputTab,
  SecurityTab,
} from "@/features/settings";

type SettingsTab =
  | "account"
  | "api"
  | "data"
  | "security"
  | "output"
  | "integrations";

type SettingsPageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

const VALID_TABS: SettingsTab[] = [
  "account",
  "api",
  "data",
  "security",
  "output",
  "integrations",
];

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const params = await searchParams;

  const tab = params?.tab;

  const activeTab: SettingsTab =
    VALID_TABS.includes(tab as SettingsTab)
      ? (tab as SettingsTab)
      : "account";

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <Card variant="default" className="p-4 shadow-xs">
              <div className="px-2 pb-4">
                <h1 className="text-lg font-semibold">
                  Settings
                </h1>

                <p className="text-sm text-base-content/60">
                  Manage your account configuration.
                </p>
              </div>

              <SettingsTabs activeTab={activeTab} />
          </Card>
        </aside>

        {/* Content */}
        <main className="space-y-6 lg:col-span-3">

          {activeTab === "account" && (
            <AccountTab/>
          )}

          {activeTab === "api" && (
            <ApiTab/>
          )}

          {activeTab === "data" && (
            <ApiTab/>
          )}
          {activeTab === "security" && (
            <SecurityTab/>
          )}
          {activeTab === "output" && (
            <OutputTab/>
          )}
          {activeTab === "integrations" && (
            <IntegrationsTab/>
          )}

        </main>
      </div>
    </div>
  );
}