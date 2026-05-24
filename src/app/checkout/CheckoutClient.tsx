"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, ArrowLeft, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import type { Plan } from "@/lib/plans";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.02-2.34Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.02 2.34C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
    </svg>
  );
}

export default function CheckoutClient({ plan }: { plan: Plan }) {
  const supabase = getSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read the session on mount, and react to the OAuth redirect coming back.
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  async function signInWith(provider: "google" | "apple") {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.href },
    });
    if (error) setError(error.message);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function handlePay() {
    setError(null);
    setSubmitting(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setError("Your session expired — please sign in again.");
        setSubmitting(false);
        return;
      }
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: plan.key }),
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        setError(json.error ?? "Could not start checkout.");
        setSubmitting(false);
        return;
      }
      window.location.href = json.url; // → Stripe Hosted Checkout
    } catch {
      setError("Network error — please try again.");
      setSubmitting(false);
    }
  }

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    user?.email ??
    "";

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Navbar />

      <div className="pt-28 pb-20 px-4">
        <div className="cp-container max-w-5xl mx-auto">
          <Link
            href="/product"
            className="inline-flex items-center gap-1.5 font-body text-sm text-[#78716C] hover:text-[#111110] transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to plans
          </Link>

          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8">
            {/* ── ORDER SUMMARY ─────────────────────────────────── */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl border border-[#E7E5E4] p-7 sticky top-24">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-[#78716C] mb-4">
                  Order summary
                </p>

                <div className="flex items-start justify-between pb-5 border-b border-[#E7E5E4]">
                  <div>
                    <h2 className="font-display text-xl text-[#111110] mb-1">
                      {plan.name}
                    </h2>
                    <p className="font-body text-sm text-[#78716C]">{plan.unit}</p>
                  </div>
                  <p className="font-display text-2xl text-[#111110]">
                    ${plan.price}
                  </p>
                </div>

                <p className="font-body text-sm text-[#78716C] leading-relaxed mt-5 mb-5">
                  {plan.blurb}
                </p>

                {/* What's included — condensed value reminder at the payment moment */}
                <div className="mb-5">
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-[#78716C] mb-3">
                    What&apos;s included
                  </p>
                  <div className="space-y-2">
                    {plan.highlights.map((line) => (
                      <div key={line} className="flex items-start gap-2">
                        <CheckCircle2
                          size={14}
                          className="text-[#DC2626] shrink-0 mt-0.5"
                        />
                        <span className="font-body text-sm text-[#111110]">
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mb-5 pt-4 border-t border-[#E7E5E4]">
                  {[
                    "Pay once. No subscription.",
                    "Sign in with Google or Apple — the same account you'll use in the app.",
                    "100% satisfaction or your money back.",
                  ].map((line) => (
                    <div key={line} className="flex items-start gap-2">
                      <CheckCircle2
                        size={14}
                        className="text-[#DC2626] shrink-0 mt-0.5"
                      />
                      <span className="font-body text-xs text-[#52525B]">
                        {line}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#E7E5E4]">
                  <span className="font-display text-base text-[#111110]">
                    Total today
                  </span>
                  <span className="font-display text-2xl text-[#111110]">
                    ${plan.price} USD
                  </span>
                </div>
              </div>
            </div>

            {/* ── AUTH + PAY ────────────────────────────────────── */}
            <div className="order-1 lg:order-2">
              <h1 className="font-display text-3xl md:text-4xl text-[#111110] mb-2 leading-tight">
                {user ? "Pay securely." : "Sign in to continue."}
              </h1>
              <p className="font-body text-sm text-[#78716C] mb-7">
                {user
                  ? "We'll send you to Stripe to pay. After payment, open the ChinaPal app with this same account — you're in."
                  : "Sign in first, so your purchase is tied to your account. Same login you'll use in the app."}
              </p>

              <div className="bg-white rounded-2xl border border-[#E7E5E4] p-7 space-y-5">
                {authLoading ? (
                  <p className="font-body text-sm text-[#A8A29E] py-6 text-center">
                    Loading…
                  </p>
                ) : !user ? (
                  <>
                    <button
                      onClick={() => signInWith("google")}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-[#E7E5E4] bg-white font-body text-sm font-semibold text-[#111110] hover:bg-[#FAFAF9] hover:border-[#D6D3D1] transition-colors"
                    >
                      <GoogleMark />
                      Continue with Google
                    </button>
                    <button
                      onClick={() => signInWith("apple")}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-[#111110] bg-[#111110] font-body text-sm font-semibold text-white hover:bg-black transition-colors"
                    >
                      <AppleMark />
                      Continue with Apple
                    </button>
                    <p className="font-body text-xs text-[#A8A29E] text-center leading-relaxed">
                      We only use this to identify your order and connect it to
                      your concierge in the app.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#E7E5E4]">
                      <div className="min-w-0">
                        <p className="font-body text-xs font-semibold uppercase tracking-widest text-[#78716C] mb-1">
                          Signed in as
                        </p>
                        <p className="font-body text-sm text-[#111110] truncate">
                          {displayName}
                        </p>
                        {user.email && displayName !== user.email && (
                          <p className="font-body text-xs text-[#A8A29E] truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E7E5E4] hover:border-[#111110] transition-colors shrink-0"
                      >
                        <LogOut size={12} className="text-[#78716C]" />
                        <span className="font-body text-xs text-[#52525B]">
                          Switch
                        </span>
                      </button>
                    </div>

                    <button
                      onClick={handlePay}
                      disabled={submitting}
                      className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Redirecting…" : `Pay $${plan.price}`}
                    </button>
                  </>
                )}

                {error && (
                  <p className="font-body text-xs text-[#DC2626] text-center">
                    {error}
                  </p>
                )}

                <div className="flex items-center justify-center gap-1.5 font-body text-xs text-[#A8A29E]">
                  <ShieldCheck size={12} />
                  Secure checkout by Stripe. Your card never touches our servers.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
