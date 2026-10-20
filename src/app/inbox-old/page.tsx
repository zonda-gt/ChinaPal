import type { Metadata } from "next";
import Inbox from "../inbox/Inbox";
// The previous inbox design, kept briefly as a fallback after the redesign.
export const metadata: Metadata = {
  title: "Team Inbox (old design)",
  robots: { index: false, follow: false },
};
export default function OldInboxPage() {
  return <Inbox />;
}
