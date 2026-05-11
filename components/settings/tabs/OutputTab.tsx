import { SettingsCard } from "../SettingsCard";
import { SettingsSectionHeader } from "../SettingsSectionHeader";

export default function OutputTab() {
  return (
    <SettingsCard>

      <SettingsSectionHeader
        title="API Output Configuration"
        description="Configure API response formatting."
      />

      <div className="form-control">
        <label className="label">
          <span className="label-text">
            Response Mode
          </span>
        </label>

        <select className="select select-bordered w-full">
          <option>Minimal</option>
          <option>Expanded</option>
        </select>
      </div>

      <div className="mockup-code text-xs">
        <pre>
          <code>{`{
  "profile": {},
  "projects": [],
  "skills": []
}`}</code>
        </pre>
      </div>

    </SettingsCard>
  );
}