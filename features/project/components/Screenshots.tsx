"use client";

import { useEffect, useState } from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

export function ScreenshotsSection({ screenshots, projectTitle }: {
  screenshots: string[];
  projectTitle: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const isOpen = selectedIndex !== null;

  const open = (index: number) => setSelectedIndex(index);
  const close = () => setSelectedIndex(null);

  const prev = () => {
    if (selectedIndex === null) return;

    setSelectedIndex((prev) =>
      prev === 0 ? screenshots.length - 1 : (prev ?? 0) - 1
    );
  };

  const next = () => {
    if (selectedIndex === null) return;

    setSelectedIndex((prev) =>
      prev === screenshots.length - 1 ? 0 : (prev ?? 0) + 1
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, selectedIndex]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Screenshots</h2>

        {screenshots.length > 0 && (
          <span className="text-sm text-base-content/50">
            {screenshots.length} image
            {screenshots.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {screenshots.length > 0 ? (
        <>
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {screenshots.map((src, idx) => (
              <button
                key={`${src}-${idx}`}
                onClick={() => open(idx)}
                aria-label={`Open screenshot ${idx + 1}`}
                className="group relative overflow-hidden rounded-xl border border-base-300 bg-base-200 shadow-sm
                transition-all duration-200 hover:shadow-lg 
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <img
                  src={src}
                  alt={`${projectTitle} screenshot ${idx + 1}`}
                  className=" h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-black/0 transition duration-200 group-hover:bg-black/20"
                />

                {/* Expand icon */}
                <div className=" absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-sm transition duration-200 group-hover:opacity-100">
                  <ArrowsPointingOutIcon className="h-4 w-4" />
                </div>
              </button>
            ))}
          </div>

          {/* MODAL */}
          {isOpen && selectedIndex !== null && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Screenshot viewer"
              className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm"
              onClick={close}
            >
              {/* FRAME */}
              <div
                className="
                  relative mx-auto flex h-full w-full max-w-5xl items-center justify-center
                  px-4 py-6
                "
                onClick={(e) => e.stopPropagation()}
              >

                {/* IMAGE CONTAINER (stabilizes layout) */}
                <div className="flex h-[85vh] w-full items-center justify-center">
                  <img
                    src={screenshots[selectedIndex]}
                    alt={`${projectTitle} screenshot ${selectedIndex + 1}`}
                    className="
                      max-h-full max-w-full rounded-xl object-contain shadow-2xl
                      transition-opacity duration-200
                    "
                  />
                </div>

                {/* MOBILE TOP BAR */}
                <div className="absolute left-4 right-4 top-4 flex items-center justify-between md:hidden">
                  <div className="rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
                    {selectedIndex + 1} / {screenshots.length}
                  </div>

                  <button
                    onClick={close}
                    aria-label="Close viewer"
                    className="rounded-full bg-black/50 p-2 text-white backdrop-blur-sm"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* DESKTOP TOP BAR */}
                <div className="absolute left-0 right-0 top-0 hidden items-center justify-between p-4 md:flex">
                  <div className="rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
                    {selectedIndex + 1} / {screenshots.length}
                  </div>

                  <button
                    onClick={close}
                    aria-label="Close viewer"
                    className="rounded-full bg-black/50 p-2 text-white backdrop-blur-sm"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* MOBILE BOTTOM CONTROLS (thumb zone) */}
                {screenshots.length > 1 && (
                  <div className="absolute left-0 right-0 flex justify-between px-6 md:hidden">
                    <button
                      onClick={prev}
                      aria-label="Previous screenshot"
                      className="rounded-full bg-black/50 p-3 text-white backdrop-blur-sm"
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>

                    <button
                      onClick={next}
                      aria-label="Next screenshot"
                      className="rounded-full bg-black/50 p-3 text-white backdrop-blur-sm"
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  </div>
                )}

                {/* DESKTOP SIDE CONTROLS */}
                {screenshots.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      aria-label="Previous screenshot"
                      className="absolute left-5 hidden rounded-full bg-black/50 p-3 text-white backdrop-blur-sm md:block"
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>

                    <button
                      onClick={next}
                      aria-label="Next screenshot"
                      className="absolute right-5 hidden rounded-full bg-black/50 p-3 text-white backdrop-blur-sm md:block"
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-base-300 p-8 text-center text-sm text-base-content/50">
          No screenshots available
        </div>
      )}
    </section>
  );
}
