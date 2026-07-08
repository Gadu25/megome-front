"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/ui/modal/Modal";
import { getPatsClient, addPatClient, revokePatClient, deletePatClient } from "@/lib/api/client/pat";
import { withRequest } from "@/utils/api/withRequest";
import { useToast } from "@/components/ui/toast/useToast";

import type { PersonalAccessToken } from "@/types/domain";
import type { PersonalAccessTokenForm } from "@/types/form";

import { SettingsCard } from "../SettingsCard";
import { SettingsInfoBox } from "../SettingsInfoBox";
import { SettingsListItem } from "../SettingsList";
import { SettingsSectionHeader } from "../SettingsSectionHeader";

type ActiveModal =
| "token"
| "logs"
| "revoke"
| "delete"
| null;

const MOCK_LOGS = [
  {
    id: 1,
    action: "GET /api/projects",
    timestamp: "2026-05-10 14:32",
    status: 200,
  },
  {
    id: 2,
    action: "POST /api/deployments",
    timestamp: "2026-05-10 15:01",
    status: 201,
  },
  {
    id: 3,
    action: "DELETE /api/cache",
    timestamp: "2026-05-11 08:14",
    status: 403,
  },
];

export default function ApiTab() {
  const { showToast } = useToast();

  const [tokens, setTokens] = useState<PersonalAccessToken[]>([]);
  const [generatedToken, setGeneratedToken] = useState("");

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [selectedToken, setSelectedToken] = useState<PersonalAccessToken | null>(null);

  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<PersonalAccessTokenForm>({ name: "" });

  const fetchTokens = async () => {
    try {
      setLoading(true);

      const res = await getPatsClient();

      const pats = Array.isArray(
        res.pats
      )
        ? res.pats
        : [];

      setTokens(pats);
    } catch (error) {
      console.error(
        "Failed to fetch PATs:",
        error
      );

      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleGenerate = async () => {
    if (!form.name.trim()) return;
    try {
      setGenerating(true);
      const data = await withRequest(
        () => addPatClient(form),
        showToast
      );

      if (!data) return;

      setGeneratedToken(data.pat);
      setActiveModal("token");
      setForm({
        name: "",
      });

      await fetchTokens();
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async () => {
    if(!selectedToken) return

    const data = await withRequest(
      () => revokePatClient(selectedToken.id),
      showToast,
    )

    if (!data) return;
    
    setTokens((prevTokens) =>
      prevTokens.map((token) =>
        token.id === selectedToken.id
          ? {
              ...token,
              revokedAt: new Date().toISOString(),
            }
          : token
      )
    );

    closeModal();
  }

  const handleDelete = async () => {
    if (!selectedToken) return

    const data = await withRequest(
      () => deletePatClient(selectedToken.id),
      showToast,
    )

    if (!data) return

    setTokens((prevTokens) =>
      prevTokens.filter(
        (token) => token.id !== selectedToken.id
      )
    );

    closeModal();
  }

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(
        generatedToken
      );

      showToast(
        "Token copied to clipboard.",
        "success"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const openLogsModal = (token: PersonalAccessToken) => {
    setSelectedToken(token);
    setActiveModal("logs");
  };

  const openRevokeModal = (token: PersonalAccessToken) => {
    setSelectedToken(token);
    setActiveModal("revoke");
  };

  const openDeleteModal = (token: PersonalAccessToken) => {
    setSelectedToken(token);
    setActiveModal("delete");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedToken(null);
  };

  const sortedTokens = useMemo(
    () =>
      [...tokens].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      ),
    [tokens]
  );

  return (
    <>
      <div className="space-y-6">
        {/* Create Token */}
        <SettingsCard>
          <SettingsSectionHeader
            title="Personal Access Tokens"
            description="Generate secure access tokens for external applications."
            action={
              <div className="badge badge-success badge-outline">
                Secure Storage
              </div>
            }
          />

          <SettingsInfoBox className="border-success/20 bg-success/5">
            <p className="text-sm leading-relaxed text-base-content/80">
              Tokens are securely hashed before storage
              and cannot be viewed again after creation.
              Store generated tokens securely.
            </p>
          </SettingsInfoBox>

          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Token Name
              </span>
            </label>
            <input
              type="text"
              value={form.name}
              placeholder="Production Application"
              className="input input-bordered w-full"
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Use a descriptive name for easier management.
              </span>
            </label>
          </div>

          <SettingsInfoBox className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-medium">
                Token Permissions
              </p>
              <p className="text-sm text-base-content/60">
                Generated tokens will receive full API access.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={
                generating || !form.name.trim()
              }
            >
              {generating ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  Generating
                </>
              ) : (
                "Generate Token"
              )}
            </button>
          </SettingsInfoBox>
        </SettingsCard>

        {/* Active Tokens */}
        <SettingsCard>
          <SettingsSectionHeader
            title="Issued Tokens"
            description="Review and manage active API access."
          />
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : sortedTokens.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-base-300 p-10 text-center">
              <p className="font-medium">
                No tokens created
              </p>
              <p className="mt-1 text-sm text-base-content/60">
                Generate your first personal access token
                to begin API integration.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTokens.map((token) => {
                const isRevoked =
                  !!token.revokedAt;
                return (
                  <SettingsListItem
                    key={token.id}
                    title={token.name}
                    action={
                      <div className="flex flex-wrap items-center gap-2">
                        <button className="btn btn-ghost btn-sm"
                          onClick={() =>
                            openLogsModal(token)
                          }
                          aria-label={`View logs for ${token.name}`}
                        >
                          View Logs
                        </button>

                        {!isRevoked ? (
                          <button className="btn btn-outline btn-warning btn-sm"
                            onClick={() =>
                              openRevokeModal(token)
                            }
                            aria-label={`Revoke ${token.name}`}
                          >
                            Revoke
                          </button>
                        ) : (
                          <button className="btn btn-outline btn-error btn-sm"
                            onClick={() =>
                              openDeleteModal(token)
                            }
                            aria-label={`Delete ${token.name}`}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    }
                  >
                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-base-content/60">
                      <div className={`badge badge-sm ${
                            isRevoked
                              ? "badge-error"
                              : "badge-success"
                          }`}
                        >
                          {isRevoked ? "Revoked" : "Active"}
                      </div>

                      <span>
                        Created{" "}{new Date(token.createdAt).toLocaleDateString()}
                      </span>

                      {token.lastUsedAt && (
                        <>
                          <span className="opacity-40">•</span>
                          <span>
                            Last used{" "}
                            {new Date(
                              token.lastUsedAt
                            ).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </SettingsListItem>
                );
              })}
            </div>
          )}
        </SettingsCard>
      </div>

      {/* Generated Token Modal */}
      <Modal
        isOpen={activeModal === "token"}
        onClose={closeModal}
        cancelText="Done"
        onCancel={closeModal}
        title="Personal Access Token"
      >
        <div className="space-y-5">

          <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4">
            <p className="text-sm leading-relaxed text-base-content/80">
              This token will only be shown once for
              security reasons. Store it securely before
              closing this dialog.
            </p>
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-200/40">
            <div className="flex items-start justify-between gap-4 p-4">
              <code className="block break-all text-sm leading-relaxed">
                {generatedToken}
              </code>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square shrink-0"
                onClick={handleCopyToken}
                aria-label="Copy token"
              >
                <ClipboardIcon className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Logs Modal */}
      <Modal
        isOpen={activeModal === "logs"}
        onClose={closeModal}
        cancelText="Close"
        onCancel={closeModal}
        title={`Usage Logs — ${selectedToken?.name ?? ""}`}
      >

        <div className="space-y-3">

          {MOCK_LOGS.map((log) => (
            <div
              key={log.id}
              className="rounded-xl border border-base-300 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-medium text-sm">
                    {log.action}
                  </p>
                  <p className="text-xs text-base-content/60">
                    {log.timestamp}
                  </p>
                </div>
                <div
                  className={`badge badge-sm ${
                    log.status >= 400
                      ? "badge-error"
                      : "badge-success"
                  }`}
                >
                  {log.status}
                </div>
              </div>
            </div>
          ))}
        </div>

      </Modal>

      {/* Revoke Modal */}
      <Modal
        isOpen={activeModal === "revoke"}
        onClose={closeModal}
        cancelText="Cancel"
        acceptText="Revoke Token"
        onCancel={closeModal}
        onAccept={handleRevoke}
        title="Revoke Token"
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-error/20 bg-error/5 p-4">
            <p className="text-sm leading-relaxed text-base-content/80">
              You are about to revoke access for:
            </p>
            <p className="mt-2 font-semibold">
              {selectedToken?.name}
            </p>
          </div>
          <p className="text-sm text-base-content/60">
            This action will permanently disable API
            access for this token.
          </p>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={activeModal === "delete"}
        onClose={closeModal}
        cancelText="Cancel"
        acceptText="Delete Token"
        onCancel={closeModal}
        onAccept={handleDelete}
        title="Delete Token"
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-error/20 bg-error/5 p-4">
            <p className="text-sm leading-relaxed text-base-content/80">
              You are about to permanently delete:
            </p>
            <p className="mt-2 font-semibold">
              {selectedToken?.name}
            </p>
          </div>
          <p className="text-sm text-base-content/60">
            This action permanently removes the token
            record and cannot be undone.
          </p>
        </div>
      </Modal>
    </>
  );
}
