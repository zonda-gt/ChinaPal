import type { Metadata } from "next";
import InboxV2 from "./InboxV2";
export const metadata: Metadata = {
  title: "Team Inbox (new design)",
  robots: { index: false, follow: false },
};
export default function InboxV2Page() {
  return <InboxV2 />;
}
