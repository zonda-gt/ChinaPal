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

          {/* Links */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-2">
            <div className="space-y-2.5">
              <p className="font-body text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Product</p>
              <Link href="/product" className="block font-body text-sm text-white/55 hover:text-white transition-colors">Pricing</Link>
              <a href="/#how-it-works" className="block font-body text-sm text-white/55 hover:text-white transition-colors">How it works</a>
              <a href="/#included" className="block font-body text-sm text-white/55 hover:text-white transition-colors">What&apos;s included</a>
            </div>
            <div className="space-y-2.5">
              <p className="font-body text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Resources</p>
              <a href="/#guides" className="block font-body text-sm text-white/55 hover:text-white transition-colors">China Guides</a>
              <a href="/product#faq" className="block font-body text-sm text-white/55 hover:text-white transition-colors">FAQ</a>
              <a href="#" className="block font-body text-sm text-white/55 hover:text-white transition-colors">Contact</a>
            </div>
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
