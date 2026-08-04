"use client";

import { useState, useEffect } from "react";
import { SettingsCard } from "../SettingsCard";
import { SettingsSectionHeader } from "../SettingsSectionHeader";
import { changeEmailClient, changeUsernameClient, deleteAccountClient } from "@/lib/api/client/account";
import { useToast } from "@/components/ui/toast/useToast";
import { withRequest } from "@/utils/api/withRequest";

type InitData = {
  user: { id: number; email: string; username: string };
};

export default function AccountTab() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [username, setUsername] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingUsername, setLoadingUsername] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    fetch("/api/init", { credentials: "include" })
      .then((res) => res.json())
      .then((data: InitData) => {
        setEmail(data.user.email);
        setCurrentEmail(data.user.email);
        setUsername(data.user.username);
      })
      .catch(console.error);
  }, []);

  const handleChangeEmail = async () => {
    if (!email.trim() || !emailPassword) return;
    setLoadingEmail(true);
    const res = await withRequest(
      () => changeEmailClient(email, emailPassword),
      showToast
    );
    if (res) {
      setCurrentEmail(email);
      setEmailPassword("");
    }
    setLoadingEmail(false);
  };

  const handleChangeUsername = async () => {
    if (!username.trim()) return;
    setLoadingUsername(true);
    await withRequest(() => changeUsernameClient(username), showToast);
    setLoadingUsername(false);
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return;
    setLoadingDelete(true);
    const res = await withRequest(() => deleteAccountClient(deletePassword), showToast);
    if (res) {
      window.location.href = "/auth";
    }
    setLoadingDelete(false);
  };

  return (
    <>
      <SettingsCard>
        <SettingsSectionHeader
          title="Email"
          description="Change your account email address. Requires current password."
        />
        <div className="form-control gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
            placeholder="your@email.com"
          />
          <input
            type="password"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Current password"
          />
          <div>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleChangeEmail}
              disabled={loadingEmail || !email.trim() || !emailPassword || email === currentEmail}
            >
              {loadingEmail ? <span className="loading loading-spinner loading-xs" /> : null}
              Change Email
            </button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard>
        <SettingsSectionHeader
          title="Username"
          description="Change your public username."
        />
        <div className="form-control gap-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered w-full"
            placeholder="username"
          />
          <div>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleChangeUsername}
              disabled={loadingUsername || !username.trim()}
            >
              {loadingUsername ? <span className="loading loading-spinner loading-xs" /> : null}
              Change Username
            </button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard className="border-error/20 bg-error/5">
        <SettingsSectionHeader
          title="Danger Zone"
          description="Permanently delete your account and all data. This action cannot be undone."
        />
        <div className="form-control gap-3">
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter your password to confirm"
          />
          <div>
            <button
              className="btn btn-error btn-sm"
              onClick={handleDeleteAccount}
              disabled={loadingDelete || !deletePassword}
            >
              {loadingDelete ? <span className="loading loading-spinner loading-xs" /> : null}
              Delete Account
            </button>
          </div>
        </div>
      </SettingsCard>
    </>
  );
}
