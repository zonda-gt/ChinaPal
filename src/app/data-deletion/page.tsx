import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import DataDeletionInstructions from "@/components/DataDeletionInstructions";

export const metadata: Metadata = {
  title: "Data Deletion Instructions",
  description: "Request deletion of your ChinaPal personal information, Instagram messages, attachments, and support records.",
  alternates: { canonical: "https://www.chinapal.co/data-deletion" },
};

export default function DataDeletionPage() {
  return (
    <LegalPage title="Request data deletion">
      <p>
        These instructions apply to ChinaPal and the ChinaPal Concierge / ChinaPal
        Concierge-IG app. Requests are handled by our team by email.
      </p>
      <DataDeletionInstructions />
      <p><Link href="/privacy">Read the full privacy policy.</Link></p>
    </LegalPage>
  );
}
