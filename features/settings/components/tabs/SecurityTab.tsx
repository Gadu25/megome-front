import { SettingsCard } from "../SettingsCard";
import { SettingsSectionHeader } from "../SettingsSectionHeader";

export default function SecurityTab() {
  return (
    <SettingsCard>

      <SettingsSectionHeader
        title="Security Controls"
        description="Monitor sessions and API activity."
      />

      <div className="stats stats-vertical w-full border border-base-200 shadow-none md:stats-horizontal">

        <div className="stat">
          <div className="stat-title">
            Active Sessions
          </div>

          <div className="stat-value text-2xl">
            2
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">
            API Requests
          </div>

          <div className="stat-value text-2xl">
            1.2k
          </div>
        </div>

      </div>

      <div className="alert">
        <span className="text-sm">
          Security actions will appear here once the backend is connected.
        </span>
      </div>

    </SettingsCard>
  );
}
