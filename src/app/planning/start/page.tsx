import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Almost done — Connect on WhatsApp",
  description:
    "One quick message on WhatsApp and we'll send your custom China itinerary within 24 hours. Free, no booking fee.",
};

const WA_TEXT = encodeURIComponent(
  "Hi ChinaPal! I'd like a custom China itinerary.\n\nMy trip:\n• Cities: \n• Dates: \n• Travellers: \n\nAnything else I should mention:",
);
const WA_LINK = `https://wa.me/8618201806768?text=${WA_TEXT}`;

export default function PlanningStartPage() {
  return (
    <div className="planning">
      <style>{`
        .planning { font-family: 'Plus Jakarta Sans', sans-serif; background-color: oklch(0.985 0.005 80); color: oklch(0.18 0.01 260); min-height: 100vh; }
        .planning .font-display { font-family: 'Fraunces', serif; }
        .planning .text-red-cp { color: oklch(0.48 0.22 25); }
        .planning .bg-red-cp { background-color: oklch(0.48 0.22 25); }
        .planning .bg-cream { background-color: oklch(0.96 0.006 80); }
        .planning .text-muted { color: oklch(0.52 0.01 260); }
        .planning .border-red-soft { border-color: oklch(0.85 0.08 25); }
        .planning .bg-red-soft { background-color: oklch(0.92 0.05 25); }
        .planning .bg-red-tint { background-color: oklch(0.97 0.02 25); }
        @keyframes pulse-wa { 0%,100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.35);} 50% { box-shadow: 0 0 0 14px rgba(37, 211, 102, 0); } }
        .planning .pulse-wa { animation: pulse-wa 2s ease-in-out infinite; }
      `}</style>

      <header className="border-b border-stone-200/60 bg-white/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/planning" className="text-[22px] font-extrabold tracking-tight">
              China<span className="text-red-cp">Pal</span>
            </Link>
            <Link href="/planning" className="text-sm text-muted hover:text-red-cp transition-colors">
              ← Back
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 py-10 md:py-16">
        <div className="max-w-xl mx-auto">
          {/* Progress steps */}
          <div className="flex items-center justify-center gap-2 mb-8 text-xs font-semibold uppercase tracking-widest">
            <span className="text-muted">1. Your trip</span>
            <span className="text-muted">→</span>
            <span className="text-red-cp">2. Send message</span>
            <span className="text-muted">→</span>
            <span className="text-muted">3. Plan in 24h</span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 md:p-10 text-center">
            {/* WhatsApp icon */}
            <div
              className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3 leading-tight">
              One message away from your <span className="text-red-cp">custom plan.</span>
            </h1>
            <p className="text-sm md:text-base text-muted mb-7 max-w-sm mx-auto leading-relaxed">
              Tap below to open WhatsApp. We&apos;ve started the message for you — just fill in your cities, dates, and who&apos;s going.
            </p>

            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="pulse-wa inline-flex items-center justify-center gap-2 text-white font-semibold px-10 py-4 rounded-full text-lg"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Open WhatsApp
            </a>
            <div className="mt-5 text-xs text-muted">
              Free · no booking fee · reply usually within an hour
            </div>
          </div>

          {/* What to include */}
          <div className="mt-8 bg-red-tint border border-red-tint rounded-2xl p-5 md:p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-red-cp mb-3">
              Include in your message
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-red-cp font-bold">•</span>
                <span>
                  <span className="font-semibold">Cities or regions</span>
                  <span className="text-muted"> — Shanghai, Zhangjiajie, Xi&apos;an… or &ldquo;first-time, surprise me&rdquo;</span>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-cp font-bold">•</span>
                <span>
                  <span className="font-semibold">Dates</span>
                  <span className="text-muted"> — even rough ones help (e.g. &ldquo;last week of June&rdquo;)</span>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-cp font-bold">•</span>
                <span>
                  <span className="font-semibold">Who&apos;s going</span>
                  <span className="text-muted"> — solo, couple, family of 4, group of 6…</span>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-cp font-bold">•</span>
                <span>
                  <span className="font-semibold">Vibe or budget</span>
                  <span className="text-muted"> — optional, but helps us tailor</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Reassurance */}
          <div className="mt-8 grid grid-cols-3 gap-3 md:gap-5 text-center">
            <div>
              <div className="font-display text-xl md:text-2xl font-bold text-red-cp leading-none">24h</div>
              <div className="text-[11px] md:text-xs text-muted mt-1">Plan turnaround</div>
            </div>
            <div>
              <div className="font-display text-xl md:text-2xl font-bold text-red-cp leading-none">£0</div>
              <div className="text-[11px] md:text-xs text-muted mt-1">To ask</div>
            </div>
            <div>
              <div className="font-display text-xl md:text-2xl font-bold text-red-cp leading-none">240+</div>
              <div className="text-[11px] md:text-xs text-muted mt-1">Trips handled</div>
            </div>
          </div>

          <p className="text-center text-xs text-muted mt-10 leading-relaxed max-w-sm mx-auto">
            Prefer email? <a href="mailto:hello@chinapal.co" className="underline text-red-cp">hello@chinapal.co</a> — same team, slower reply.
          </p>
        </div>
      </main>

      <footer className="py-8 px-4 text-center text-xs text-muted">
        <div className="font-display font-bold text-sm mb-1">
          China<span className="text-red-cp">Pal</span>
        </div>
        © 2026 ChinaPal. All rights reserved.
      </footer>
    </div>
  );
}
