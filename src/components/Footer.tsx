import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#111110] border-t border-white/8">
      <div className="cp-container py-14">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="mb-4">
              <span className="text-xl font-extrabold text-white no-underline tracking-tight">
                China<span className="text-red">Pal</span>
              </span>
            </div>
            <p className="font-body text-sm text-white/40 leading-relaxed">
              Travel independently in China, with a local expert one text away.
            </p>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/25">&copy; 2026 ChinaPal. All rights reserved.</p>
          <p className="font-body text-xs text-white/25">Helping foreign travelers navigate China.</p>
        </div>
      </div>
    </footer>
  );
}
