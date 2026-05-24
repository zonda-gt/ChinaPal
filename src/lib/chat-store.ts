// localStorage-backed chat store — placeholder for real backend.
// TODO: swap for Supabase-backed concierge API once env wiring is set up.
// API surface mirrors the v2 Concierge module so the swap stays small.

export type ChatMessage = {
  id: string;
  from: "user" | "team";
  text: string;
  ts: number;
};

export type ChatIdentity = {
  name: string;
  email?: string;
  plan?: string;
};

const MSG_KEY = "chinapal_chat_messages";
const ID_KEY = "chinapal_chat_identity";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getMessages(): ChatMessage[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(MSG_KEY);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

export function appendMessage(msg: ChatMessage): ChatMessage[] {
  const all = [...getMessages(), msg];
  if (isBrowser()) {
    localStorage.setItem(MSG_KEY, JSON.stringify(all));
  }
  return all;
}

export function clearMessages() {
  if (isBrowser()) localStorage.removeItem(MSG_KEY);
}

export function getIdentity(): ChatIdentity | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(ID_KEY);
    return raw ? (JSON.parse(raw) as ChatIdentity) : null;
  } catch {
    return null;
  }
}

export function setIdentity(id: ChatIdentity) {
  if (isBrowser()) localStorage.setItem(ID_KEY, JSON.stringify(id));
}

export function makeId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
