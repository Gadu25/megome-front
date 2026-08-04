"use client";

import { useState } from "react";
import { SettingsCard } from "../SettingsCard";
import { SettingsSectionHeader } from "../SettingsSectionHeader";
import { exportDataClient } from "@/lib/api/client/data";
import { useToast } from "@/components/ui/toast/useToast";

export default function DataTab() {
  const { showToast } = useToast();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportDataClient();
      showToast("Export downloaded successfully", "success");
    } catch (err) {
      showToast("Export failed", "error");
    }
    setExporting(false);
  };

  return (
    <SettingsCard>
      <SettingsSectionHeader
        title="Export Portfolio Data"
        description="Download all your portfolio data as a JSON file."
      />
        <div className="space-y-4">
          <div className="rounded-xl border border-base-200 bg-base-50 p-4">
            <p className="text-sm leading-relaxed text-base-content/80">
              This will export your profile, experiences, skills, education, projects,
              and certifications into a single downloadable JSON file.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Exporting...
              </>
            ) : (
              "Export as JSON"
            )}
          </button>
        </div>
    </SettingsCard>
  );
}
