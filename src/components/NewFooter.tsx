"use client";

/* ChinaPal Footer — minimal, clean
   Design: "Calm Authority" — dark charcoal bg, warm white text */

export default function Footer() {
  return (
    <footer className="py-12 px-4" style={{ backgroundColor: "oklch(0.18 0.01 260)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "oklch(0.48 0.22 25)" }}>
              <span className="text-white font-bold text-sm font-display">CP</span>
            </div>
            <span className="font-display font-bold text-xl text-white">ChinaPal</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            © 2025 ChinaPal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
