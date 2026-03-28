"use client";

import { useState } from "react";

const CHRONICLE_URL = "https://chronicle-auto-api.vercel.app";
const AGENT_ID = "26a66d2e-9e27-410d-9ec9-a16c0797c16c";

export function ChronicleButton({ apiKey }: { apiKey?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      if (apiKey) {
        const res = await fetch(`${CHRONICLE_URL}/api/integrate/prepare`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentId: AGENT_ID,
            secrets: { PINGTEXT_API_KEY: apiKey },
          }),
        });
        if (res.ok) {
          const { url } = await res.json();
          window.open(url, "_blank");
          return;
        }
      }
      window.open(`${CHRONICLE_URL}/integrate/${AGENT_ID}`, "_blank");
    } catch {
      window.open(`${CHRONICLE_URL}/integrate/${AGENT_ID}`, "_blank");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-3 bg-surface border border-border px-5 py-3 rounded-lg font-mono text-sm hover:border-muted transition-colors disabled:opacity-60 cursor-pointer"
    >
      <span className="flex flex-col items-start gap-0.5">
        <span className="font-medium">
          {loading ? "Preparing..." : "Integrate PingText →"}
        </span>
        <span className="text-[10px] text-muted">
          powered by chronicle{apiKey ? " · API key included" : ""}
        </span>
      </span>
    </button>
  );
}
