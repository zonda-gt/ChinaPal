"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";

type Panel = "list" | "details" | "composer";
type Sizes = Partial<Record<Panel, number>>;
const STORAGE_KEY = "chinapal-inbox-panel-sizes-v1";
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

export default function usePanelLayout() {
  const workspace = useRef<HTMLElement>(null);
  const list = useRef<HTMLElement>(null);
  const details = useRef<HTMLElement>(null);
  const main = useRef<HTMLElement>(null);
  const composer = useRef<HTMLElement>(null);
  const [sizes, setSizes] = useState<Sizes>({});
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<Panel | null>(null);
  const drag = useRef<{ panel: Panel; pointer: number; start: number; size: number } | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        const valid: Sizes = {};
        for (const key of ["list", "details", "composer"] as const) {
          if (typeof saved?.[key] === "number" && Number.isFinite(saved[key]))
            valid[key] = clamp(saved[key], 120, 800);
        }
        setSizes(valid);
      } catch { /* Storage may be disabled or contain an older value. */ }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready || active) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sizes)); } catch { /* Resizing still works without persistence. */ }
  }, [sizes, ready, active]);

  function measure(panel: Panel) {
    const element = { list, details, composer }[panel].current;
    const rect = element?.getBoundingClientRect();
    if (!element || !rect) return 250;
    if (panel === "composer") return rect.height;
    const style = getComputedStyle(element);
    return rect.width + parseFloat(style.marginLeft || "0") + parseFloat(style.marginRight || "0");
  }

  function bounds(panel: Panel) {
    const width = workspace.current?.clientWidth || window.innerWidth;
    if (panel === "composer") return { min: 160, max: Math.max(160, (main.current?.clientHeight || 500) - 210) };
    const desktop = window.innerWidth > 1200;
    const rail = desktop ? 64 : 56;
    if (panel === "details") return { min: 260, max: Math.min(560, width - rail - measure("list") - 360) };
    return { min: desktop ? 260 : 240, max: Math.min(520, width - rail - (desktop ? measure("details") : 0) - (desktop ? 360 : 320)) };
  }

  function resize(panel: Panel, value: number) {
    const { min, max } = bounds(panel);
    setSizes((previous) => ({ ...previous, [panel]: Math.round(clamp(value, min, max)) }));
  }

  function reset(panel: Panel) {
    setSizes((previous) => {
      const next = { ...previous };
      delete next[panel];
      return next;
    });
  }

  function handle(panel: Panel, label: string, controls: string) {
    const horizontal = panel === "composer";
    const sign = panel === "list" ? 1 : -1;
    const finish = (event: PointerEvent<HTMLDivElement>) => {
      if (drag.current?.pointer !== event.pointerId) return;
      drag.current = null;
      setActive(null);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    };
    return {
      role: "separator" as const,
      tabIndex: 0,
      "aria-label": label,
      "aria-controls": controls,
      "aria-orientation": horizontal ? "horizontal" as const : "vertical" as const,
      "aria-valuenow": sizes[panel] || ({ list: 320, details: 290, composer: 250 }[panel]),
      "aria-valuemin": panel === "composer" ? 120 : 240,
      "aria-valuemax": panel === "composer" ? 800 : panel === "list" ? 520 : 560,
      "aria-valuetext": sizes[panel] ? `${sizes[panel]} pixels` : "Default size",
      title: `${label}. Drag or use arrow keys. Double-click to reset.`,
      onDoubleClick: () => reset(panel),
      onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { panel, pointer: event.pointerId, start: horizontal ? event.clientY : event.clientX, size: measure(panel) };
        setActive(panel);
      },
      onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
        const current = drag.current;
        if (!current || current.pointer !== event.pointerId || current.panel !== panel) return;
        resize(panel, current.size + sign * ((horizontal ? event.clientY : event.clientX) - current.start));
      },
      onPointerUp: finish,
      onPointerCancel: finish,
      onLostPointerCapture: finish,
      onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
        const negative = horizontal ? "ArrowUp" : "ArrowLeft";
        const positive = horizontal ? "ArrowDown" : "ArrowRight";
        if (event.key === negative || event.key === positive) {
          event.preventDefault();
          resize(panel, measure(panel) + (event.key === positive ? 1 : -1) * sign * (event.shiftKey ? 40 : 10));
        } else if (event.key === "Home") {
          event.preventDefault();
          reset(panel);
        }
      },
    };
  }

  return {
    workspace, list, details, main, composer, handle, active,
    style: {
      ...(sizes.list ? { "--list-width": `${sizes.list}px` } : {}),
      ...(sizes.details ? { "--details-width": `${sizes.details}px` } : {}),
      ...(sizes.composer ? { "--composer-height": `${sizes.composer}px` } : {}),
    } as CSSProperties,
  };
}
