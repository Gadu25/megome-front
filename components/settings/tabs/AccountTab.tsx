import { SettingsCard } from "../SettingsCard";
import { SettingsSectionHeader } from "../SettingsSectionHeader";

export default async function AccountTab() {
  return (
    <>
      <SettingsCard>
        <SettingsSectionHeader
          title="Account Identity"
          description="Update your public profile information."
        />

        {/* content */}
      </SettingsCard>

      <SettingsCard className="border-error/20 bg-error/5">
        <SettingsSectionHeader
          title="Danger Zone"
          description="Permanently remove your account and API access."
          action={
            <button className="btn btn-error btn-sm">
              Delete Account
            </button>
          }
        />
      </SettingsCard>
    </>
  )
}