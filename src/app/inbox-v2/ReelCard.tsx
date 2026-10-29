"use client";
import { ArrowUpRight, Clapperboard, Loader2, MapPin, RotateCcw } from "lucide-react";
import type { AmapMatch, ReelKind, ReelView } from "@/lib/inbox/reel-data";
import v from "./v2.module.css";

const KIND: Record<ReelKind, string> = {
  place: "Place",
  places: "Places",
  ranking: "Ranking",
  itinerary: "Sample itinerary",
  how_to: "How-to",
  mood: "Mood",
};

function Match({ m }: { m?: AmapMatch }) {
  if (!m) return null;
  const text =
    m.status === "confirmed"
      ? `Amap ✓ ${m.name ?? ""}`
      : m.status === "close"
        ? `Amap ≈ ${m.name ?? ""}${m.relation ? ` (${m.relation})` : ""}`
        : m.status === "several"
          ? "Several branches or sites"
          : m.status === "not_found"
            ? "Not found on Amap"
            : m.status === "not_a_place"
              ? ""
              : "Amap check failed";
  if (!text) return null;
  return (
    <span className={`${v.reelMatch} ${m.status === "confirmed" || m.status === "close" ? v.reelMatchOk : ""}`} title={m.reason}>
      <MapPin size={11} /> {text}
      {m.address && <small>{m.address}</small>}
    </span>
  );
}

/** A reel the traveller shared, with what the AI found in it. */
export default function ReelCard({ reel, busy, onRetry }: { reel: ReelView & { attempts?: number }; busy: boolean; onRetry: () => void }) {
  const note = reel.note;
  return (
    <div className={v.reel}>
      <div className={v.reelHead}>
        <Clapperboard size={13} /> Shared reel{reel.owner && <span> · @{reel.owner}</span>}
        <a href={reel.url} target="_blank" rel="noreferrer">
          Open <ArrowUpRight size={12} />
        </a>
      </div>
      {reel.status === "done" && note ? (
        <>
          <p className={v.reelShort}>{note.short}</p>
          <details className={v.reelDetails}>
            <summary>
              {KIND[note.kind]}
              {note.places.length > 0 && ` · ${note.places.length} place${note.places.length > 1 ? "s" : ""}`}
              {note.promo && " · tour ad"}
            </summary>
            <p>{note.summary}</p>
            {note.places.length > 0 && (
              <ul>
                {note.places.map((p, i) => (
                  <li key={i}>
                    <b>
                      {p.rank > 0 && `#${p.rank} `}
                      {p.name}
                    </b>{" "}
                    {p.name_cn} · {p.city}
                    {p.confidence === "guess" && <em> (guess)</em>}
                    <div>{p.what}</div>
                    {p.tips.length > 0 && (
                      <ul>
                        {p.tips.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    )}
                    {p.confidence !== "guess" && <Match m={p.amap} />}
                  </li>
                ))}
              </ul>
            )}
            {note.route.length > 0 && <p>Route: {note.route.join(" → ")}</p>}
            {note.tips.length > 0 && (
              <ul>
                {note.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </details>
        </>
      ) : reel.status === "failed" ? (
        <p className={v.reelState}>
          Couldn&apos;t read this reel{reel.error && `: ${reel.error}`}
          {(reel.attempts ?? 0) < 3 && (
            <button onClick={onRetry} disabled={busy}>
              <RotateCcw size={11} /> Try again
            </button>
          )}
        </p>
      ) : (
        <p className={v.reelState}>
          <Loader2 size={12} className={v.spinIcon} /> Reading this reel…{reel.caption && <small>{reel.caption.slice(0, 140)}</small>}
        </p>
      )}
    </div>
  );
}
