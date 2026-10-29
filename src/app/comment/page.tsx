import type { Metadata } from "next";
import CommentReplies from "./CommentReplies";
export const metadata: Metadata = {
  title: "Comment Replies",
  robots: { index: false, follow: false },
};
export default function CommentPage() {
  return <CommentReplies />;
}
