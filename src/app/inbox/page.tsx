import type { Metadata } from "next";
import Inbox from "./Inbox";
export const metadata: Metadata = {
  title: "Team Inbox",
  robots: { index: false, follow: false },
};
export default function InboxPage() {
  return <Inbox />;
}
