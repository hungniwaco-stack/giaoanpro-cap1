"use client";

import ReactMarkdown from "react-markdown";
import StampSeal from "./StampSeal";
import type { HoatDong } from "@/lib/types";

export default function ResultPanel({
  title,
  markdown,
  openingActivity,
  onDownloadDocx,
  onDownloadPptx,
}: {
  title: string;
  markdown: string;
  openingActivity?: HoatDong;
  onDownloadDocx: () => void;
  onDownloadPptx: () => void;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-5 py-4">
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button
            onClick={onDownloadPptx}
            className="rounded-lg border border-ink/15 px-3 py-1.5 text-ink-muted hover:bg-sand"
          >
            Tải PPT
          </button>
          <button
            onClick={onDownloadDocx}
            className="rounded-lg bg-pine px-3 py-1.5 font-medium text-paper hover:bg-pine-dark"
          >
            Tải Word
          </button>
        </div>
      </div>

      <div className="flex items-start gap-4 px-5 py-5">
        <StampSeal />
        <div className="max-h-96 flex-1 overflow-auto text-sm text-ink-muted">
          {openingActivity && (
            <div className="mb-4 rounded-xl border-2 border-dashed border-seal/40 bg-seal/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-seal">
                🎮 Khởi động vui — {openingActivity.ten}
              </p>
              <p className="mt-1 text-sm text-ink">{openingActivity.cachThucHien}</p>
            </div>
          )}
          <ReactMarkdown
            components={{
              h1: (p) => <h1 className="mb-2 font-display text-lg font-semibold text-ink" {...p} />,
              h2: (p) => <h2 className="mb-2 mt-4 font-display text-base font-semibold text-ink" {...p} />,
              h3: (p) => <h3 className="mb-1 mt-3 font-semibold text-ink" {...p} />,
              p: (p) => <p className="mb-2 leading-relaxed" {...p} />,
              ul: (p) => <ul className="mb-2 list-disc space-y-1 pl-5" {...p} />,
              ol: (p) => <ol className="mb-2 list-decimal space-y-1 pl-5" {...p} />,
              strong: (p) => <strong className="font-semibold text-ink" {...p} />,
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
