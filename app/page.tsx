import Link from "next/link";

export default function HomePage() {
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
            <Link href="/auth/signin" className="text-sm text-muted hover:text-white transition-colors">Sign In</Link>
            <Link href="/auth/signup" className="text-sm bg-white text-black px-3 py-1.5 rounded-md font-semibold hover:opacity-90">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-border py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-surface border border-border px-3 py-1 rounded-full text-xs text-muted mb-6">
            <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
            Now with international SMS support
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
            SMS that<br /><span className="text-accent">just works.</span>
          </h1>
          <p className="mt-5 text-lg text-muted max-w-md leading-relaxed">
            The developer-first SMS API. Send text messages globally with 3 lines of code. No carrier contracts, no complexity.
          </p>
          <div className="mt-8 flex gap-3 flex-wrap">
            <Link href="/auth/signup" className="bg-white text-black px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90">Get Started Free →</Link>
            <Link href="#code" className="border border-border px-6 py-3 rounded-lg text-sm font-medium hover:border-muted">View Documentation</Link>
          </div>
        </div>
      </section>

      {/* Code */}
      <section id="code" className="border-b border-border py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">Quick Start</p>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Three lines. That&rsquo;s it.</h2>
          <p className="text-muted text-sm mb-8 max-w-sm">Install the SDK, create a client, send a message.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border font-mono text-xs text-muted flex items-center gap-2">
                <span className="bg-border px-2 py-0.5 rounded text-[10px]">TypeScript</span>
                send-sms.ts
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-zinc-300 overflow-x-auto">
{`import { PingText } from "pingtext";

const pt = new PingText(process.env.PINGTEXT_API_KEY);

await pt.messages.send({
  to: "+15551234567",
  body: "Your order has shipped! 📦",
});`}
              </pre>
            </div>
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border font-mono text-xs text-muted flex items-center gap-2">
                <span className="bg-border px-2 py-0.5 rounded text-[10px]">Python</span>
                send_sms.py
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-zinc-300 overflow-x-auto">
{`import pingtext, os

pt = pingtext.PingText(os.environ["PINGTEXT_API_KEY"])

pt.messages.send(
    to="+15551234567",
    body="Your order has shipped! 📦",
)`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Built for developers</h2>
          <div className="grid md:grid-cols-3 gap-px bg-border border border-border rounded-xl overflow-hidden">
            {[
              { icon: "⚡", title: "Sub-second delivery", desc: "Messages hit carrier networks in under 200ms." },
              { icon: "🌍", title: "200+ countries", desc: "Send SMS globally. Local numbers, automatic encoding." },
              { icon: "🔑", title: "Simple auth", desc: "One API key. Bearer token. No OAuth flows." },
              { icon: "📊", title: "Delivery tracking", desc: "Real-time status: queued, sent, delivered, failed." },
              { icon: "🛡️", title: "Built-in compliance", desc: "TCPA compliance and carrier filtering baked in." },
              { icon: "🔧", title: "Official SDKs", desc: "TypeScript and Python with full type safety." },
            ].map((f) => (
              <div key={f.title} className="bg-[#0a0a0a] p-8">
                <div className="w-9 h-9 bg-surface border border-border rounded-lg flex items-center justify-center text-lg mb-4">{f.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight mb-4">Start sending in seconds</h2>
        <p className="text-muted mb-8">Create a free account and get your API key instantly.</p>
        <Link href="/auth/signup" className="bg-white text-black px-8 py-3 rounded-lg font-semibold text-sm hover:opacity-90">Get Started Free →</Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent rounded flex items-center justify-center font-mono text-[8px] font-bold text-black">P</div>
            <span className="font-mono text-xs font-medium">pingtext</span>
          </div>
          <span className="text-xs text-muted">© 2026 PingText Inc.</span>
        </div>
      </footer>
    </div>
  );
}
