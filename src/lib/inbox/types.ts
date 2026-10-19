export type Attachment = {
  type: "image" | "video" | "audio" | "file";
  url: string;
};
export type ContactIdentity = {
  peer_id: string;
  username: string;
  name: string | null;
  picture: string | null;
  refresh_at: number;
};
export type Conversation = {
  peer_id: string;
  thread_id: string | null;
  username: string;
  stage: "inquiry" | "customer" | "archived";
  notes: string;
  last_message_at: string | null;
  last_seen_at: string | null;
  history_cursor: string | null;
  history_complete: boolean;
  synced_at: string | null;
  last_preview?: string;
  last_direction?: string;
  sending_draft_id: string | null;
};
export type Message = {
  id: string;
  peer_id: string;
  direction: "inbound" | "outbound";
  sent_at: string;
  text: string;
  attachments: Attachment[];
  deleted: boolean;
  unavailable: boolean;
};
export type Draft = {
  id: string;
  peer_id: string;
  body: string;
  version: number;
  context_id: string | null;
  status: "draft" | "sending" | "sent" | "failed" | "unknown";
  warnings: string[];
  edited_by: string;
  updated_at: string;
  sent_message_id: string | null;
};
export type Staff = { email: string; name: string };
export class InboxError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
