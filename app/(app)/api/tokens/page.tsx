"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardIcon, KeyIcon } from "@heroicons/react/24/outline";

import Modal from "@/components/modal/Modal";
import { Card } from "@/components/common/Card";
import { ApiPageHeader } from "@/components/api/ApiPageHeader";

import { useToast } from "@/components/toast/useToast";
import { withRequest } from "@/functions/withRequest";

import {
  addPatClient,
  deletePatClient,
  getPatsClient,
  revokePatClient,
} from "@/lib/api/client/pat";

import type {
  PersonalAccessToken,
  PersonalAccessTokenForm,
} from "@/types/types";

type ActiveModal = "token" | "revoke" | "delete" | null;

/* ---------------- Page ---------------- */

export default function ApiTokensPage() {
  const { showToast } = useToast();

  const [tokens, setTokens] = useState<PersonalAccessToken[]>([]);
  const [generatedToken, setGeneratedToken] = useState("");

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [selectedToken, setSelectedToken] =
    useState<PersonalAccessToken | null>(null);

  const [form, setForm] = useState<PersonalAccessTokenForm>({
    name: "",
  });

  /* ---------------- Data ---------------- */

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const res = await getPatsClient();

      setTokens(Array.isArray(res.pats) ? res.pats : []);
    } catch {
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const sortedTokens = useMemo(
    () =>
      [...tokens].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      ),
    [tokens]
  );

  const closeModal = () => {
    setActiveModal(null);
    setSelectedToken(null);
  };

  /* ---------------- Actions ---------------- */

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
      setForm({ name: "" });
      setActiveModal("token");

      await fetchTokens();
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async () => {
    if (!selectedToken) return;

    const data = await withRequest(
      () => revokePatClient(selectedToken.id),
      showToast
    );

    if (!data) return;

    setTokens((prev) =>
      prev.map((t) =>
        t.id === selectedToken.id
          ? { ...t, revokedAt: new Date().toISOString() }
          : t
      )
    );

    closeModal();
  };

  const handleDelete = async () => {
    if (!selectedToken) return;

    const data = await withRequest(
      () => deletePatClient(selectedToken.id),
      showToast
    );

    if (!data) return;

    setTokens((prev) => prev.filter((t) => t.id !== selectedToken.id));

    closeModal();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedToken);
    showToast("Token copied to clipboard.", "success");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">
      <ApiPageHeader
        title="Access Tokens"
        description="Manage personal access tokens used to authenticate API requests."
        action={
          <div className="badge badge-success badge-lg gap-2">
            Secure Storage
          </div>
        }
      />

      {/* CREATE TOKEN */}
      <Card className="p-4">
        <div className="flex items-start gap-5">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <KeyIcon className="size-6" />
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Create Token</h2>
              <p className="mt-1 text-sm text-base-content/60">
                Generate a secure token for external applications and integrations.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Token Name</label>

              <input
                className="input input-bordered w-full"
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                placeholder="Production App"
              />

              <p className="text-sm text-base-content/50">
                Use descriptive names to identify tokens later.
              </p>
            </div>

            <Card className="p-4 bg-warning/5 border border-warning/10">
              <p className="text-sm text-base-content/70">
                Tokens are shown only once and securely hashed before storage.
              </p>
            </Card>

            <div className="flex justify-end">
              <button
                className="btn btn-primary"
                onClick={handleGenerate}
                disabled={generating || !form.name.trim()}
              >
                {generating && (
                  <span className="loading loading-spinner loading-xs" />
                )}
                Generate Token
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* TOKEN LIST */}
      <Card className="p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Issued Tokens</h2>
          <p className="mt-1 text-sm text-base-content/60">
            Review and manage API credentials.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : sortedTokens.length === 0 ? (
          <Card className="p-10 text-center border border-dashed border-base-300">
            <p className="font-medium">No tokens created</p>
            <p className="mt-1 text-sm text-base-content/50">
              Generate your first token to begin authenticating API requests.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedTokens.map((token) => {
              const revoked = !!token.revokedAt;

              return (
                <Card key={token.id} className="p-5">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{token.name}</h3>

                        <div
                          className={`badge badge-sm ${
                            revoked ? "badge-error" : "badge-success"
                          }`}
                        >
                          {revoked ? "Revoked" : "Active"}
                        </div>
                      </div>

                      <div className="text-sm text-base-content/50 flex gap-4 flex-wrap">
                        <span>
                          Created{" "}
                          {new Date(token.createdAt).toLocaleDateString()}
                        </span>

                        {token.lastUsedAt && (
                          <span>
                            Last used{" "}
                            {new Date(token.lastUsedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!revoked ? (
                        <button
                          className="btn btn-outline btn-warning btn-sm"
                          onClick={() => {
                            setSelectedToken(token);
                            setActiveModal("revoke");
                          }}
                        >
                          Revoke
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline btn-error btn-sm"
                          onClick={() => {
                            setSelectedToken(token);
                            setActiveModal("delete");
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {/* MODALS (unchanged logic) */}
      <Modal
        isOpen={activeModal === "token"}
        onClose={closeModal}
        title="Personal Access Token"
        cancelText="Done"
        onCancel={closeModal}
      >
        <Card className="p-4 bg-warning/5 border border-warning/10">
          <p className="text-sm">This token will only be shown once.</p>
        </Card>

        <Card className="p-4 mt-4">
          <div className="flex justify-between items-start gap-4">
            <code className="text-sm break-all">{generatedToken}</code>

            <button
              className="btn btn-ghost btn-sm btn-square"
              onClick={handleCopy}
            >
              <ClipboardIcon className="size-5" />
            </button>
          </div>
        </Card>
      </Modal>

      <Modal
        isOpen={activeModal === "revoke"}
        onClose={closeModal}
        title="Revoke Token"
        acceptText="Revoke"
        cancelText="Cancel"
        onAccept={handleRevoke}
        onCancel={closeModal}
      >
        <p className="text-sm text-base-content/60">
          This will permanently disable API access for:
        </p>
        <p className="mt-3 font-semibold">{selectedToken?.name}</p>
      </Modal>

      <Modal
        isOpen={activeModal === "delete"}
        onClose={closeModal}
        title="Delete Token"
        acceptText="Delete"
        cancelText="Cancel"
        onAccept={handleDelete}
        onCancel={closeModal}
      >
        <p className="text-sm text-base-content/60">
          This action permanently removes the token record.
        </p>
        <p className="mt-3 font-semibold">{selectedToken?.name}</p>
      </Modal>
    </div>
  );
}