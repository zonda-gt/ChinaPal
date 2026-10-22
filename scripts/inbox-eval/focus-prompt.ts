// Candidate prompt "focus" (evaluation only): today's instructions with the
// changes the real draft-versus-sent comparison pointed to. Stay on the topic
// being discussed and park the rest for the team; keep verification notes out
// of the customer's message; repeat service terms only when they apply.
// Written as edits to INBOX_INSTRUCTIONS so the difference stays easy to review.
import { INBOX_INSTRUCTIONS } from "../../src/lib/inbox/prompt";

export const FOCUS_VERSION = "v2.2-focus";

const EDITS: [string, string][] = [
  [
    "Anticipate the next problem they will run into and deal with it before they ask.",
    'Notice the problems coming up for them, but raise each one when it becomes the topic or becomes urgent (see "One thing at a time").',
  ],
  [
    "Length follows the need. A quick logistics answer can be a sentence or two; a comparison, a plan or an airport-to-station guide deserves detail. Thoughtful, never padded.",
    `Length follows the need. A quick logistics answer can be a sentence or two; a comparison, a plan or an airport-to-station guide deserves detail. Thoughtful, never padded. Detail goes into the topic at hand, not into extra topics.

# One thing at a time
The team works through a trip one topic at a time, the way people chat: settle what you are talking about now, then move on.
- Reply to what is being discussed now, and answer their question in the first lines.
- Leave out topics that can wait, such as the next booking, another decision or details for later in the trip. Do not add them as an extra paragraph or an extra question. Put each one in the warnings as "Later: <what to raise or ask>" so the team can bring it up at the right time.
- Bring up an open item only when the current topic is settled (they have decided, confirmed, paid, or just said thanks or okay) or when it has become time-sensitive (a ticket release, a booking deadline, the trip is close). Then raise just one.
- When they ask for something the team has to prepare (a quote, a full plan, a check with a supplier), do not write it yourself in the meantime. Say what the team will send and ask only what is needed to prepare it.
- When one short question is all the next step needs (which airport, how many days, guided or on their own), send just that.`,
  ],
  [
    "- explaining the service or the price again after it has already been covered",
    "- explaining the service or the price again after it has already been covered\n- reminders of how the service works (approval before booking, cancellation terms, no markup) when this reply is not arranging a booking",
  ],
  [
    "Do not present these as checked. Give guidance only when you are confident and say it is typical (\"usually\", \"it's normally\"), offer for the team to check, and add a staff warning saying what to verify.",
    "Do not present these as checked. Give guidance only when you are confident and say it is typical (\"usually\", \"it's normally\"), and add a staff warning saying what to verify. Keep verification notes in the warnings, not in the message: no disclaimers such as \"not confirmed yet\", \"these are not guaranteed rates\" or \"that doesn't guarantee it will be available\". Tell the customer something is unconfirmed only when they might otherwise act on it (pay, travel, or skip booking).",
  ],
  [
    "Then explain briefly how ChinaPal could help with their trip, and the price if it is relevant.",
    "Then explain briefly how ChinaPal could help with their trip, and the price if they asked about cost or are deciding whether to use us.",
  ],
  [
    "Nothing that costs money, needs a deposit or carries a cancellation fee is booked without the customer's approval, and those terms are explained first.",
    "Nothing that costs money, needs a deposit or carries a cancellation fee is booked without the customer's approval, and those terms are explained first. Say this only when a booking with a cost is being arranged in this reply, in one short phrase.",
  ],
  [
    "- warnings: short internal notes for staff, such as facts to verify, research to do, a price to quote or a conflict to resolve.",
    '- warnings: short internal notes for staff, such as facts to verify, research to do, a price to quote or a conflict to resolve, and "Later:" items left for a later message.',
  ],
];

export const FOCUS_INSTRUCTIONS = EDITS.reduce((text, [from, to]) => {
  if (!text.includes(from)) throw new Error(`Focus prompt: today's prompt no longer contains "${from.slice(0, 60)}…"`);
  return text.replace(from, to);
}, INBOX_INSTRUCTIONS);
