"use client";

import { useEffect, useState, useCallback } from "react";
import { SettingsCard } from "../SettingsCard";
import { SettingsSectionHeader } from "../SettingsSectionHeader";
import { SettingsListItem } from "../SettingsList";
import {
  changePasswordClient,
  getSessionsClient,
  revokeSessionClient,
} from "@/lib/api/client/security";
import { useToast } from "@/components/ui/toast/useToast";
import { withRequest } from "@/utils/api/withRequest";

type SessionInfo = {
  id: number;
  userId: number;
  expiresAt: string;
  createdAt: string;
};

export default function SecurityTab() {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoadingSessions(true);
      const res = await getSessionsClient();
      setSessions(res.sessions ?? []);
    } catch (err) {
      showToast("Failed to load sessions", "error");
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    setLoadingPassword(true);
    const res = await withRequest(
      () => changePasswordClient(currentPassword, newPassword),
      showToast
    );
    if (res) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoadingPassword(false);
  };

  const handleRevoke = async (id: number) => {
    setRevokingId(id);
    const res = await withRequest(() => revokeSessionClient(id), showToast);
    if (res) {
      setSessions((prev) => prev.filter((s) => s.id !== id));
    }
    setRevokingId(null);
  };

  return (
    <>
      <SettingsCard>
        <SettingsSectionHeader
          title="Change Password"
          description="Update your account password."
        />
        <div className="form-control gap-3">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Current password"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input input-bordered w-full"
            placeholder="New password (min 8 characters)"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Confirm new password"
          />
          <div>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleChangePassword}
              disabled={loadingPassword || !currentPassword || !newPassword || newPassword !== confirmPassword}
            >
              {loadingPassword ? <span className="loading loading-spinner loading-xs" /> : null}
              Change Password
            </button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard>
        <SettingsSectionHeader
          title="Active Sessions"
          description="Devices and browsers currently signed in to your account."
        />
        {loadingSessions ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-md" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-base-300 p-10 text-center">
            <p className="font-medium">No active sessions</p>
            <p className="mt-1 text-sm text-base-content/60">
              Find a list of all your active sessions here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <SettingsListItem
                key={session.id}
                title={`Session ${session.id}`}
                action={
                  <button
                    className="btn btn-outline btn-warning btn-sm"
                    onClick={() => handleRevoke(session.id)}
                    disabled={revokingId === session.id}
                  >
                    {revokingId === session.id ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : null}
                    Revoke
                  </button>
                }
              >
                <p className="text-xs text-base-content/60 mt-2">
                  Created {new Date(session.createdAt).toLocaleDateString()} at{" "}
                  {new Date(session.createdAt).toLocaleTimeString()}
                </p>
                <p className="text-xs text-base-content/60">
                  Expires {new Date(session.expiresAt).toLocaleDateString()}
                </p>
              </SettingsListItem>
            ))}
          </div>
        )}
      </SettingsCard>
    </>
  );
}
