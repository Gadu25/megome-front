import { SettingsCard } from "../SettingsCard";
import { SettingsListItem } from "../SettingsList";
import { SettingsSectionHeader } from "../SettingsSectionHeader";

const entities = [
  "Profile",
  "Projects",
  "Experience",
  "Education",
  "Skills",
  "Certificates",
];

export default function PortfolioDataTab() {
  return (
    <SettingsCard>

      <SettingsSectionHeader
        title="Portfolio Structure"
        description="Structured entities exposed through the API."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {entities.map((entity) => (
          <SettingsListItem
            key={entity}
            title={entity}
            description="Structured API entity"
          />
        ))}
      </div>

    </SettingsCard>
  );
}