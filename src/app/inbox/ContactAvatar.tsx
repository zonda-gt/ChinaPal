"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import s from "./inbox.module.css";
export default function ContactAvatar({ name, picture }: { name: string; picture?: string | null }) {
  const [failed, setFailed] = useState<string | null>(null);
  return <span className={s.avatar}>
    {picture && failed !== picture
      ? <img src={picture} alt="" referrerPolicy="no-referrer" loading="lazy"
          onError={() => setFailed(picture)} />
      : name.replace(/^@/, "").slice(0, 2).toUpperCase()}
  </span>;
}
