import type { Metadata } from "next";
import InboxV2 from "../inbox-v2/InboxV2";
export const metadata: Metadata = {
  title: "Team Inbox",
  robots: { index: false, follow: false },
};
export default function InboxPage() {
  return <InboxV2 />;
}
