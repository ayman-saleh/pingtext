"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, signOut, type User } from "@/lib/auth";

const CHRONICLE_URL = "https://chronicle-auto-api.vercel.app";
const AGENT_ID = "26a66d2e-9e27-410d-9ec9-a16c0797c16c";

interface Message {
  id: string;
  status: string;
  to: string;
  body: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [copied, setCopied] = useState(false);
  const [integrating, setIntegrating] = useState(false);

  // Test send
  const [sendTo, setSendTo] = useState("+15551234567");
  const [sendBody, setSendBody] = useState("Hello from PingText!");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/auth/signin");
      return;
    }
    setUser(u);
    loadMessages();
  }, [router]);

  async function loadMessages() {
    try {
      const res = await fetch("/api/v1/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages ?? []);
      }
    } catch {}
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.apiKey}`,
        },
        body: JSON.stringify({ to: sendTo, body: sendBody }),
      });
      const data = await res.json();
      if (res.ok) {
        setSendResult(`✓ Sent! ID: ${data.id}`);
        loadMessages();
      } else {
        setSendResult(`✗ ${data.error?.message ?? "Failed"}`);
      }
    } catch {
      setSendResult("✗ Network error");
    }
    setSending(false);
  }

  function copyKey() {
    if (!user) return;
    navigator.clipboard.writeText(user.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleIntegrate() {
    if (!user) return;
    setIntegrating(true);
    try {
      const res = await fetch(`${CHRONICLE_URL}/api/integrate/prepare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: AGENT_ID,
          secrets: { PINGTEXT_API_KEY: user.apiKey },
        }),
      });
      if (res.ok) {
        const { url } = await res.json();
        window.open(url, "_blank");
      } else {
        window.open(`${CHRONICLE_URL}/integrate/${AGENT_ID}`, "_blank");
      }
    } catch {
      window.open(`${CHRONICLE_URL}/integrate/${AGENT_ID}`, "_blank");
    }
    setIntegrating(false);
  }

  function handleSignOut() {
    signOut();
    router.push("/");
  }

  if (!user) return null;

  const stats = {
    total: messages.length,
    delivered: messages.filter((m) => m.status === "delivered").length,
    failed: messages.filter((m) => m.status === "failed").length,
  };

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent rounded flex items-center justify-center font-mono text-xs font-bold text-black">P</div>
            <span className="font-mono text-sm font-semibold">pingtext</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">{user.email}</span>
            <button onClick={handleSignOut} className="text-sm text-muted hover:text-white transition-colors">Sign Out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted mt-1">Welcome back, {user.name}.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Sent", value: stats.total },
            { label: "Delivered", value: stats.delivered },
            { label: "Failed", value: stats.failed },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-border rounded-xl p-5">
              <p className="font-mono text-xs text-muted uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-3xl font-bold font-mono">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* API Key */}
          <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
            <div>
              <p className="font-mono text-xs text-muted uppercase tracking-wider mb-1">Your API Key</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-black border border-border px-3 py-2 rounded-lg font-mono text-sm text-accent truncate">
                  {user.apiKey}
                </code>
                <button
                  onClick={copyKey}
                  className="text-xs text-muted hover:text-white border border-border px-3 py-2 rounded-lg transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted mb-3">Add PingText to any project with one click. Your API key is attached automatically.</p>
              <button
                onClick={handleIntegrate}
                disabled={integrating}
                className="w-full flex items-center justify-center gap-3 bg-black border border-border px-4 py-3 rounded-lg font-mono text-sm hover:border-muted transition-colors disabled:opacity-60"
              >
                <span className="flex flex-col items-start gap-0.5">
                  <span className="font-medium">{integrating ? "Preparing..." : "Integrate PingText →"}</span>
                  <span className="text-[10px] text-muted">powered by chronicle · API key included</span>
                </span>
              </button>
            </div>
          </div>

          {/* Test Send */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <p className="font-mono text-xs text-muted uppercase tracking-wider mb-4">Send a Test Message</p>
            <form onSubmit={handleSend} className="space-y-3">
              <div>
                <label className="block text-xs text-muted mb-1">To (E.164)</label>
                <input
                  type="text"
                  value={sendTo}
                  onChange={(e) => setSendTo(e.target.value)}
                  className="w-full bg-black border border-border px-3 py-2 rounded-lg text-sm font-mono focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Message</label>
                <textarea
                  value={sendBody}
                  onChange={(e) => setSendBody(e.target.value)}
                  rows={2}
                  className="w-full bg-black border border-border px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-accent resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-accent text-black py-2 rounded-lg font-semibold text-sm hover:bg-accent-hover transition-colors disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send SMS"}
              </button>
              {sendResult && (
                <p className={`text-xs font-mono ${sendResult.startsWith("✓") ? "text-accent" : "text-red-400"}`}>
                  {sendResult}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Message History */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <p className="font-mono text-xs text-muted uppercase tracking-wider">Message History</p>
          </div>
          {messages.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted">
              No messages yet. Send a test message above.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {messages.slice(0, 20).map((msg) => (
                <div key={msg.id} className="px-6 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted">{msg.id}</span>
                      <span className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded ${
                        msg.status === "delivered" ? "bg-accent/10 text-accent" :
                        msg.status === "failed" ? "bg-red-500/10 text-red-400" :
                        "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-sm truncate mt-0.5">{msg.body}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="font-mono text-xs text-muted">{msg.to}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
