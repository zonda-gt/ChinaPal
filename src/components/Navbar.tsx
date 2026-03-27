"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const cities = [
  { slug: "beijing", name: "Beijing" },
  { slug: "shanghai", name: "Shanghai" },
  { slug: "xian", name: "Xi'an" },
  { slug: "chengdu", name: "Chengdu" },
  { slug: "chongqing", name: "Chongqing" },
  { slug: "hangzhou", name: "Hangzhou" },
  { slug: "guilin", name: "Guilin" },
  { slug: "zhangjiajie", name: "Zhangjiajie" },
  { slug: "lijiang", name: "Lijiang" },
  { slug: "dali", name: "Dali" },
  { slug: "kunming", name: "Kunming" },
  { slug: "shangri-la", name: "Shangri-La" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const linkClass = scrolled || pathname !== "/"
    ? "text-[#52525B] hover:text-[#111110] hover:bg-[#F4F4F5]"
    : "text-white/80 hover:text-white hover:bg-white/10";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#E7E5E4] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="cp-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className={`text-[22px] font-extrabold no-underline tracking-tight transition-colors ${
              scrolled ? "text-[#111110]" : pathname === "/" ? "text-white" : "text-[#111110]"
            }`}
          >
            China<span className="text-red">Pal</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <a
              href="/#how-it-works"
              className={`font-body text-sm font-medium px-3.5 py-2 rounded-full transition-colors ${linkClass}`}
            >
              How it works
            </a>
            <a
              href="/product"
              className={`font-body text-sm font-medium px-3.5 py-2 rounded-full transition-colors ${linkClass}`}
            >
              Product
            </a>

            {/* Guides dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setGuidesOpen(true)}
              onMouseLeave={() => setGuidesOpen(false)}
            >
              <button
                className={`font-body text-sm font-medium px-3.5 py-2 rounded-full transition-colors inline-flex items-center gap-1 ${linkClass}`}
              >
                Guides
                <ChevronDown size={14} className={`transition-transform duration-200 ${guidesOpen ? "rotate-180" : ""}`} />
              </button>

              {guidesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                  <div className="bg-white rounded-xl border border-[#E7E5E4] shadow-lg py-2 min-w-[180px]">
                    {cities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/${city.slug}`}
                        className="block px-4 py-2 font-body text-sm text-[#52525B] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                      >
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="https://wa.me/447549879026?text=Hey%21%20I%27m%20planning%20a%20trip%20to%20China%20and%20could%20use%20some%20help%20%F0%9F%87%A8%F0%9F%87%B3" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2 px-5">
              Ask ChinaPal Free
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled || pathname !== "/" ? "text-[#111110]" : "text-white"
            }`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#E7E5E4] px-5 py-4 space-y-1">
          <a
            href="/#how-it-works"
            className="block font-body text-sm font-medium text-[#52525B] py-2.5 hover:text-[#DC2626] transition-colors"
            onClick={() => setOpen(false)}
          >
            How it works
          </a>
          <a
            href="/product"
            className="block font-body text-sm font-medium text-[#52525B] py-2.5 hover:text-[#DC2626] transition-colors"
            onClick={() => setOpen(false)}
          >
            Pricing
          </a>
          <div>
            <p className="font-body text-xs font-semibold text-[#A8A29E] uppercase tracking-widest pt-3 pb-2">
              Guides
            </p>
            <div className="grid grid-cols-2 gap-1">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}`}
                  className="font-body text-sm text-[#52525B] py-1.5 hover:text-[#DC2626] transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="pt-3">
            <a href="https://wa.me/447549879026?text=Hey%21%20I%27m%20planning%20a%20trip%20to%20China%20and%20could%20use%20some%20help%20%F0%9F%87%A8%F0%9F%87%B3" target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center text-sm">
              Ask ChinaPal Free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
