"use client";

import { useEffect, useMemo, useState } from "react";
import { patApi } from "@/lib/api/patApi";

import { ClipboardIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/modal/Modal";

import type {
  PersonalAccessToken,
  PersonalAccessTokenForm,
} from "@/types/types";

import { SettingsCard } from "../SettingsCard";
import { SettingsInfoBox } from "../SettingsInfoBox";
import { SettingsListItem } from "../SettingsList";
import { SettingsSectionHeader } from "../SettingsSectionHeader";
import { withRequest } from "@/functions/withRequest";
import { useToast } from "@/components/toast/useToast";


export default function ApiTab() {
  const { getPATs, addPAT } = patApi();
  const { showToast } = useToast();
  const [tokens, setTokens] = useState<
    PersonalAccessToken[]
  >([]);

  const [generatedToken, setGeneratedToken] =
  useState("");

  const [tokenModalOpen, setTokenModalOpen] =
    useState(false);

  const [generating, setGenerating] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] =
    useState<PersonalAccessTokenForm>({
      name: "",
    });

  const fetchTokens = async () => {
    try {
      setLoading(true);

      const res = await getPATs();

      const pats = Array.isArray(
        res.data?.pats
      )
        ? res.data.pats
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
        () => addPAT(form),
        showToast
      );

      if (!data) return;

      setGeneratedToken(data.pat);

      setTokenModalOpen(true);

      setForm({
        name: "",
      });

      await fetchTokens();
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(
        generatedToken
      );

      showToast("Token copied to clipboard.", "success");
    } catch (error) {
      console.error(error);
    }
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
            <div>
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
                Generate your first personal access token to begin API integration.
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
                      <div className="flex items-center gap-2">

                        <button className="btn btn-ghost btn-sm">
                          View Logs
                        </button>

                        <button className="btn btn-outline btn-error btn-sm">
                          Revoke
                        </button>

                      </div>
                    }
                  >
                    <div className="mt-3 flex flex-wrap items-center gap-2">

                      <div
                        className={`badge badge-sm ${
                          isRevoked
                            ? "badge-error"
                            : "badge-success"
                        }`}
                      >
                        {isRevoked
                          ? "Revoked"
                          : "Active"}
                      </div>

                      <span className="text-xs text-base-content/50">
                        Created{" "}
                        {new Date(
                          token.createdAt
                        ).toLocaleDateString()}
                      </span>

                      {token.lastUsedAt && (
                        <span className="text-xs text-base-content/50">
                          • Last used{" "}
                          {new Date(
                            token.lastUsedAt
                          ).toLocaleDateString()}
                        </span>
                      )}

                    </div>
                  </SettingsListItem>
                );
              })}

            </div>
          )}

        </SettingsCard>

      </div>

      <Modal
        isOpen={tokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
        cancelText="Done"
        onCancel={() => setTokenModalOpen(false)}
        title="Personal Access Token"
      >

        <div className="space-y-5">

          <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4">
            <p className="text-sm leading-relaxed text-base-content/80">
              This token will only be shown once for
              security reasons. Store it securely before
              closing this dialog. You will not be able
              to view it again.
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
    </>
  );
}