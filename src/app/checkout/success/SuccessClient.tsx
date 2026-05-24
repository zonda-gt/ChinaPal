"use client";

import { CheckCircle2, MessageCircle, Smartphone, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import type { Plan } from "@/lib/plans";
import { whatsappLink } from "@/lib/plans";

// Where the actual product lives (the inbound_travel concierge app).
const APP_URL = "https://app.hellochina.chat";

export default function SuccessClient({ plan }: { plan: Plan }) {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Navbar />

      <div className="pt-28 pb-20 px-4">
        <div className="cp-container max-w-2xl mx-auto">
          {/* ── CONFIRMATION ─────────────────────────────────── */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FEF2F2] mb-5">
              <CheckCircle2 size={28} className="text-[#DC2626]" />
            </div>
            <span className="pill-badge bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] mb-5">
              Payment received
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-[#111110] leading-[1.05] mb-4">
              {plan.successHeadline}
            </h1>
            <p className="font-body text-base text-[#78716C] leading-relaxed max-w-md mx-auto">
              {plan.successHint}
            </p>
          </div>

          {/* ── ORDER STRIP ──────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5 flex items-center justify-between mb-8">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-[#78716C] mb-0.5">
                {plan.name}
              </p>
              <p className="font-body text-sm text-[#111110]">{plan.unit}</p>
            </div>
            <p className="font-display text-xl text-[#111110]">${plan.price}</p>
          </div>

          {/* ── HANDOFF ──────────────────────────────────────── */}
          <p className="font-body text-xs font-semibold text-[#DC2626] uppercase tracking-widest text-center mb-5">
            Start your trip help
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {/* The app — where the concierge lives */}
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl border-2 border-[#DC2626] p-6 text-left transition-all hover:shadow-[0_8px_32px_rgba(220,38,38,0.18)] hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
                  <Smartphone size={18} className="text-[#DC2626]" />
                </div>
                <span className="pill-badge bg-[#FEF2F2] text-[#DC2626] text-[10px] px-2.5 py-0.5">
                  Recommended
                </span>
              </div>
              <h3 className="font-display text-lg text-[#111110] mb-1.5">
                Open the ChinaPal app
              </h3>
              <p className="font-body text-sm text-[#78716C] leading-relaxed mb-4">
                Sign in with the <strong>same Google account</strong> — your
                purchase is already linked, and your saved plans and concierge
                thread live here.
              </p>
              <span className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-[#DC2626] group-hover:gap-2 transition-all">
                Open the app
                <ArrowRight size={14} />
              </span>
            </a>

            {/* WhatsApp — immediate human channel */}
            <a
              href={whatsappLink(plan)}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl border border-[#E7E5E4] p-6 text-left transition-all hover:border-[#111110] hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] flex items-center justify-center mb-4">
                <MessageCircle size={18} className="text-[#111110]" />
              </div>
              <h3 className="font-display text-lg text-[#111110] mb-1.5">
                Or message us on WhatsApp
              </h3>
              <p className="font-body text-sm text-[#78716C] leading-relaxed mb-4">
                Best for quick on-the-go help right now. Same local team, same
                response time.
              </p>
              <span className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-[#111110] group-hover:gap-2 transition-all">
                Open WhatsApp
                <ArrowRight size={14} />
              </span>
            </a>
          </div>

          <p className="text-center font-body text-xs text-[#A8A29E]">
            Use the same Google account in the app. Receipt sent to your email.
          </p>
        </div>
      </div>
    </div>
  );
}
