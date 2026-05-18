"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ClipboardIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";

import Modal from "@/components/modal/Modal";

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

import { ApiPageHeader } from "@/components/api/ApiPageHeader";

type ActiveModal =
  | "token"
  | "revoke"
  | "delete"
  | null;

export default function ApiTokensPage() {
  const { showToast } = useToast();

  const [tokens, setTokens] = useState<
    PersonalAccessToken[]
  >([]);

  const [generatedToken, setGeneratedToken] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [activeModal, setActiveModal] =
    useState<ActiveModal>(null);

  const [selectedToken, setSelectedToken] =
    useState<PersonalAccessToken | null>(
      null
    );

  const [form, setForm] =
    useState<PersonalAccessTokenForm>({
      name: "",
    });

  const fetchTokens = async () => {
    try {
      setLoading(true);

      const res = await getPatsClient();

      setTokens(
        Array.isArray(res.pats)
          ? res.pats
          : []
      );
    } catch (error) {
      console.error(error);

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
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      ),
    [tokens]
  );

  const closeModal = () => {
    setActiveModal(null);
    setSelectedToken(null);
  };

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

      setForm({
        name: "",
      });

      setActiveModal("token");

      await fetchTokens();
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async () => {
    if (!selectedToken) return;

    const data = await withRequest(
      () =>
        revokePatClient(
          selectedToken.id
        ),
      showToast
    );

    if (!data) return;

    setTokens((prev) =>
      prev.map((token) =>
        token.id === selectedToken.id
          ? {
              ...token,
              revokedAt:
                new Date().toISOString(),
            }
          : token
      )
    );

    closeModal();
  };

  const handleDelete = async () => {
    if (!selectedToken) return;

    const data = await withRequest(
      () =>
        deletePatClient(
          selectedToken.id
        ),
      showToast
    );

    if (!data) return;

    setTokens((prev) =>
      prev.filter(
        (token) =>
          token.id !==
          selectedToken.id
      )
    );

    closeModal();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      generatedToken
    );

    showToast(
      "Token copied to clipboard.",
      "success"
    );
  };

  return (
    <>
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

        {/* Create */}
        <section className="rounded-3xl border border-base-300 bg-base-100 p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <KeyIcon className="size-6" />
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">
                  Create Token
                </h2>

                <p className="mt-1 text-sm text-base-content/70">
                  Generate a secure token
                  for external applications
                  and integrations.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Token Name
                </label>

                <input
                  type="text"
                  placeholder="Production App"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="input input-bordered w-full"
                />

                <p className="text-sm text-base-content/60">
                  Use descriptive names to
                  identify tokens later.
                </p>
              </div>

              <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4">
                <p className="text-sm text-base-content/80">
                  Tokens are shown only
                  once and securely hashed
                  before storage.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  className="btn btn-primary"
                  onClick={handleGenerate}
                  disabled={
                    generating ||
                    !form.name.trim()
                  }
                >
                  {generating && (
                    <span className="loading loading-spinner loading-xs" />
                  )}

                  Generate Token
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* List */}
        <section className="rounded-3xl border border-base-300 bg-base-100 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Issued Tokens
            </h2>

            <p className="mt-1 text-sm text-base-content/70">
              Review and manage API
              credentials.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : sortedTokens.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-base-300 p-12 text-center">
              <p className="font-medium">
                No tokens created
              </p>

              <p className="mt-1 text-sm text-base-content/60">
                Generate your first token
                to begin authenticating API
                requests.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTokens.map((token) => {
                const revoked =
                  !!token.revokedAt;

                return (
                  <div
                    key={token.id}
                    className="rounded-2xl border border-base-300 p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">
                            {token.name}
                          </h3>

                          <div
                            className={`badge badge-sm ${
                              revoked
                                ? "badge-error"
                                : "badge-success"
                            }`}
                          >
                            {revoked
                              ? "Revoked"
                              : "Active"}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-base-content/60">
                          <span>
                            Created{" "}
                            {new Date(
                              token.createdAt
                            ).toLocaleDateString()}
                          </span>

                          {token.lastUsedAt && (
                            <span>
                              Last used{" "}
                              {new Date(
                                token.lastUsedAt
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {!revoked ? (
                          <button
                            className="btn btn-outline btn-warning btn-sm"
                            onClick={() => {
                              setSelectedToken(
                                token
                              );

                              setActiveModal(
                                "revoke"
                              );
                            }}
                          >
                            Revoke
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline btn-error btn-sm"
                            onClick={() => {
                              setSelectedToken(
                                token
                              );

                              setActiveModal(
                                "delete"
                              );
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
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
            <p className="text-sm">
              This token will only be shown
              once.
            </p>
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-200/40">
            <div className="flex items-start justify-between gap-4 p-4">
              <code className="block break-all text-sm">
                {generatedToken}
              </code>

              <button
                className="btn btn-ghost btn-sm btn-square"
                onClick={handleCopy}
              >
                <ClipboardIcon className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Revoke */}
      <Modal
        isOpen={
          activeModal === "revoke"
        }
        onClose={closeModal}
        title="Revoke Token"
        acceptText="Revoke"
        cancelText="Cancel"
        onAccept={handleRevoke}
        onCancel={closeModal}
      >
        <p className="text-sm text-base-content/70">
          This will permanently disable API
          access for:
        </p>

        <p className="mt-3 font-semibold">
          {selectedToken?.name}
        </p>
      </Modal>

      {/* Delete */}
      <Modal
        isOpen={
          activeModal === "delete"
        }
        onClose={closeModal}
        title="Delete Token"
        acceptText="Delete"
        cancelText="Cancel"
        onAccept={handleDelete}
        onCancel={closeModal}
      >
        <p className="text-sm text-base-content/70">
          This action permanently removes
          the token record.
        </p>

        <p className="mt-3 font-semibold">
          {selectedToken?.name}
        </p>
      </Modal>
    </>
  );
}