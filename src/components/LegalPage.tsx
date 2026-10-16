import Link from "next/link";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";

export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-6 sm:px-8">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-dark">
            China<span className="text-red">Pal</span>
          </Link>
          <Link href="/" className="text-sm text-mid underline underline-offset-4 hover:text-red">
            Back to home
          </Link>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-red">Your privacy</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-mid">Last updated: October 16, 2026</p>
        <div className="mt-10 space-y-6 text-base leading-8 text-[#383838] [&_a]:break-words [&_a]:text-red [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-dark [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:pl-6 [&_p]:my-4 [&_section]:scroll-mt-8 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
