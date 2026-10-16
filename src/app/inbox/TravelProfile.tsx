"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import type { ProfileFact, ProfileResponse } from "@/lib/inbox/profile-data";
import s from "./inbox.module.css";

const statusLabels = {
  confirmed: "Stated in chat",
  inferred: "Inferred",
  suggested: "Suggested",
  unknown: "Not mentioned",
};
function Fact({ fact }: { fact: ProfileFact }) {
  return (
    <div className={s.profileFact}>
      <p>{fact.value}</p>
      {fact.status !== "unknown" && (
        <span
          className={`${s.factStatus} ${fact.status === "confirmed" ? s.factConfirmed : s.factUncertain}`}
        >
          {statusLabels[fact.status]}
        </span>
      )}
      {!!fact.sources.length && (
        <details className={s.profileSources}>
          <summary>Source{fact.sources.length > 1 ? "s" : ""}</summary>
          {fact.sources.map((source, i) => (
            <blockquote key={i}>
              <small>
                {source.role === "customer" ? "Guest" : "ChinaPal"} ·{" "}
                {new Date(source.time).toLocaleDateString()}
              </small>
              <p>{source.text}</p>
            </blockquote>
          ))}
        </details>
      )}
    </div>
  );
}
export default function TravelProfile({
  peer,
  revision,
}: {
  peer: string;
  revision: string;
}) {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true),
    [generating, setGenerating] = useState(false),
    [error, setError] = useState("");
  const mounted = useRef(true),
    running = useRef(false),
    requestId = useRef(0),
    attempted = useRef("");
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const generate = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    const request = ++requestId.current;
    setGenerating(true);
    setError("");
    try {
      const response = await fetch(`/api/inbox/conversations/${peer}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const body = await response.json();
      if (!response.ok)
        throw Error(body.error || "Could not build the travel profile.");
      if (mounted.current && request === requestId.current) setData(body);
    } catch (e) {
      if (mounted.current) setError((e as Error).message);
    } finally {
      running.current = false;
      if (mounted.current) setGenerating(false);
    }
  }, [peer]);
  useEffect(() => {
    if (running.current) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const request = ++requestId.current;
    fetch(`/api/inbox/conversations/${peer}/profile`, { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok)
          throw Error(body.error || "Could not load the travel profile.");
        return body as ProfileResponse;
      })
      .then((body) => {
        if (cancelled || request !== requestId.current) return;
        setData(body);
        if (
          body.coverage.count &&
          (!body.saved || body.stale) &&
          attempted.current !== body.sourceFingerprint
        ) {
          timer = setTimeout(
            () => {
              if (!cancelled && !running.current) {
                attempted.current = body.sourceFingerprint;
                void generate();
              }
            },
            body.saved ? 10000 : 700,
          );
        }
      })
      .catch((e) => {
        if (!cancelled && request === requestId.current) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [peer, revision, generate, generating]);
  const saved = data?.saved,
    profile = saved?.profile;
  return (
    <section
      className={`${s.infoSection} ${s.travelProfile}`}
      aria-label="Travel profile"
    >
      <div className={s.profileHeading}>
        <h3>About this person</h3>
        <Sparkles size={15} />
      </div>
      <p className={s.profileIntro}>Travel profile · AI-assisted</p>
      {loading && (
        <p role="status">
          <Loader2 size={14} className={s.spin} /> Loading profile…
        </p>
      )}
      {error && (
        <div className={s.profileError} role="alert">
          {error}
        </div>
      )}
      {data?.stale && (
        <div className={s.profileStale}>
          New information in the chat. Updating after a short pause; review this
          profile before relying on it.
        </div>
      )}
      {profile ? (
        <>
          <div className={s.profileSummary}>
            <Fact fact={profile.summary} />
          </div>
          {(
            [
              ["Arrival in China", profile.arrival],
              ["Departure", profile.departure],
              ["Travel party", profile.party],
            ] as const
          ).map(([label, fact]) => (
            <div className={s.profileField} key={label}>
              <h4>{label}</h4>
              <Fact fact={fact} />
            </div>
          ))}
          <div className={s.profileField}>
            <h4>Cities & dates</h4>
            {profile.cities.length ? (
              <ol className={s.cityTimeline}>
                {profile.cities.map((city, i) => (
                  <li key={i}>
                    <strong>{city.city}</strong>
                    <Fact fact={city.stay} />
                  </li>
                ))}
              </ol>
            ) : (
              <p className={s.profileUnknown}>Not mentioned</p>
            )}
          </div>
          {(
            [
              ["Interests & activities", profile.interests],
              ["Preferences", profile.preferences],
              ["Practical details", profile.logistics],
            ] as const
          ).map(([label, facts]) => (
            <div className={s.profileField} key={label}>
              <h4>{label}</h4>
              {facts.length ? (
                facts.map((fact, i) => <Fact key={i} fact={fact} />)
              ) : (
                <p className={s.profileUnknown}>Not mentioned</p>
              )}
            </div>
          ))}
          {!!profile.questions.length && (
            <div className={s.profileQuestions}>
              <h4>Still to clarify</h4>
              <ul>
                {profile.questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        !loading && (
          <p className={s.profileEmpty}>
            Turn the saved conversation into a quick brief: trip dates, route,
            travel party, interests and preferences.
          </p>
        )
      )}
      <button
        className={s.profileGenerate}
        onClick={() => void generate()}
        disabled={loading || generating || !data?.coverage.count}
      >
        {generating ? (
          <Loader2 size={14} className={s.spin} />
        ) : saved ? (
          <RefreshCw size={14} />
        ) : (
          <Sparkles size={14} />
        )}
        {generating
          ? "Reading saved history…"
          : saved
            ? "Refresh profile"
            : "Build travel profile"}
      </button>
      {data && (
        <div className={s.profileCoverage}>
          {saved && (
            <span>
              Updated{" "}
              {new Date(saved.generated_at).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          )}
          <span>
            {(saved?.coverage || data.coverage).count} saved text messages
            {(saved?.coverage || data.coverage).partial
              ? " · Partial history"
              : " · All saved text reviewed"}
          </span>
          {(saved?.coverage || data.coverage).partial && (
            <span>
              Earlier messages may be missing. Load older history, then refresh
              the profile.
            </span>
          )}
          {(saved?.coverage || data.coverage).attachments && (
            <span>
              Image and audio contents aren’t included in this profile.
            </span>
          )}
          {!data.coverage.count && (
            <span>
              Open or refresh this chat to load its text messages first.
            </span>
          )}
        </div>
      )}
    </section>
  );
}
