import { SettingsCard } from "../SettingsCard";
import { SettingsListItem } from "../SettingsList";
import { SettingsSectionHeader } from "../SettingsSectionHeader";

const integrations = [
  "Vercel",
  "GitHub",
  "Webhook API",
];

export default function IntegrationsTab() {
  return (
    <SettingsCard>

      <SettingsSectionHeader
        title="Integrations"
        description="Connect external services and deployment tools."
      />

      <div className="space-y-3">
        {integrations.map((integration) => (
          <SettingsListItem
            key={integration}
            title={integration}
            description="Not connected"
            action={
              <button className="btn btn-outline btn-sm">
                Connect
              </button>
            }
          />
        ))}
      </div>

    </SettingsCard>
  );
}