"use client";

import { useState, useEffect, useCallback } from "react";
import { Upload, X, RotateCcw, Check, ImageIcon } from "lucide-react";
import Link from "next/link";

/* Group image slots by activity/section for easier management */
const ACTIVITY_GROUPS = [
  {
    title: "Hero & Forest Park",
    description: "The main hero banner and Forest Park activity card",
    slots: [
      { key: "forest", label: "Hero / Main Image" },
      { key: "bailong", label: "Preview 2 — Bailong Elevator" },
      { key: "avatar", label: "Preview 3 — Avatar Pillars" },
    ],
  },
  {
    title: "Tianzi Mountain",
    description: "Tianzi Mountain activity card",
    slots: [
      { key: "tianzi", label: "Main Image" },
      { key: "tianzi_clouds", label: "Preview 2 — Sea of Clouds" },
      { key: "tianzi_preview3", label: "Preview 3" },
    ],
  },
  {
    title: "Charming Xiangxi Show",
    description: "Evening cultural show activity card",
    slots: [
      { key: "show", label: "Main Image" },
      { key: "show_stage", label: "Preview 2 — Stage View" },
      { key: "show_preview3", label: "Preview 3" },
    ],
  },
  {
    title: "Golden Whip Stream",
    description: "Golden Whip Stream activity card",
    slots: [
      { key: "golden", label: "Main Image" },
      { key: "stream_close", label: "Preview 2 — Close-up" },
    ],
  },
  {
    title: "Tujia Workshop",
    description: "Tujia brocade weaving workshop",
    slots: [
      { key: "tujia", label: "Main Image" },
    ],
  },
  {
    title: "Ten-Mile Gallery",
    description: "Evening scenic light rail",
    slots: [
      { key: "ten_mile", label: "Main Image" },
    ],
  },
  {
    title: "Other",
    description: "Concierge photo and restaurant thumbnails",
    slots: [
      { key: "concierge", label: "Concierge Mei — Avatar" },
      { key: "hunan_food", label: "Restaurant Thumbnails" },
    ],
  },
];

export default function ManageItineraryImages() {
  const [images, setImages] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    const res = await fetch("/api/itinerary-images");
    const data = await res.json();
    setImages(data.images);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDrop = async (slot: string, file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(slot);
    setMessage(null);

    const formData = new FormData();
    formData.append("slot", slot);
    formData.append("file", file);

    const res = await fetch("/api/itinerary-images", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setMessage(`Updated image`);
      await fetchImages();
    }
    setUploading(null);
  };

  const handleReset = async (slot: string) => {
    setUploading(slot);
    const res = await fetch("/api/itinerary-images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot }),
    });

    if (res.ok) {
      setMessage(`Reset to default`);
      await fetchImages();
    }
    setUploading(null);
  };

  const isCustom = (key: string) => images[key]?.startsWith("/uploads/");

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F2", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1A1A1A", padding: "20px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: 0, fontFamily: "'Fraunces', serif" }}>
              Itinerary Image Manager
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "4px 0 0" }}>
              Drop images to update the itinerary page
            </p>
          </div>
          <Link
            href="/itinerary"
            style={{
              background: "#E8271A",
              color: "#fff",
              padding: "8px 20px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            View Itinerary →
          </Link>
        </div>
      </div>

      {/* Message toast */}
      {message && (
        <div style={{ maxWidth: 900, margin: "16px auto 0", padding: "0 24px" }}>
          <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <Check size={14} color="#059669" />
            <span style={{ fontSize: 13, color: "#166534", fontWeight: 600 }}>{message}</span>
            <button onClick={() => setMessage(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <X size={14} color="#059669" />
            </button>
          </div>
        </div>
      )}

      {/* Activity groups */}
      <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 24px" }}>
        {ACTIVITY_GROUPS.map((group) => (
          <div key={group.title} style={{ marginBottom: 32 }}>
            {/* Group header */}
            <div style={{ marginBottom: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: "0 0 2px", fontFamily: "'Fraunces', serif" }}>
                {group.title}
              </h2>
              <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{group.description}</p>
            </div>

            {/* Slot cards in a row */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(group.slots.length, 3)}, 1fr)`, gap: 12 }}>
              {group.slots.map((slot) => (
                <ImageSlotCard
                  key={slot.key}
                  slotKey={slot.key}
                  label={slot.label}
                  currentUrl={images[slot.key]}
                  isCustom={isCustom(slot.key)}
                  isUploading={uploading === slot.key}
                  onDrop={(file) => handleDrop(slot.key, file)}
                  onReset={() => handleReset(slot.key)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageSlotCard({
  slotKey,
  label,
  currentUrl,
  isCustom,
  isUploading,
  onDrop,
  onReset,
}: {
  slotKey: string;
  label: string;
  currentUrl: string;
  isCustom: boolean;
  isUploading: boolean;
  onDrop: (file: File) => void;
  onReset: () => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDropEvent = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onDrop(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onDrop(file);
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        border: dragOver ? "2px solid #E8271A" : "1px solid #E8E4DE",
        transition: "all 0.15s",
        opacity: isUploading ? 0.6 : 1,
      }}
    >
      {/* Image / drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropEvent}
        style={{
          aspectRatio: "16/10",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          background: dragOver ? "#FFF0EE" : "#F5F2EE",
        }}
        onClick={() => document.getElementById(`file-${slotKey}`)?.click()}
      >
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentUrl}
            alt={label}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 6 }}>
            <ImageIcon size={28} color="#CCC" />
            <span style={{ fontSize: 11, color: "#AAA" }}>No image</span>
          </div>
        )}

        {/* Drag overlay */}
        {dragOver && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(232,39,26,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px dashed #E8271A",
          }}>
            <div style={{ background: "#fff", borderRadius: 10, padding: "8px 16px", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <Upload size={14} color="#E8271A" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#E8271A" }}>Drop to replace</span>
            </div>
          </div>
        )}

        {/* Custom badge */}
        {isCustom && (
          <div style={{ position: "absolute", top: 6, right: 6, background: "#059669", borderRadius: 20, padding: "2px 8px" }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>CUSTOM</span>
          </div>
        )}

        <input
          id={`file-${slotKey}`}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>

      {/* Label + reset */}
      <div style={{ padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>{label}</p>
        {isCustom && (
          <button
            onClick={(e) => { e.stopPropagation(); onReset(); }}
            style={{
              background: "#F5F2EE",
              border: "none",
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 10,
              fontWeight: 600,
              color: "#888",
            }}
            title="Reset to default"
          >
            <RotateCcw size={10} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
