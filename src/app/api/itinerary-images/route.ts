import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getImageMap, setSlotImage, resetSlotImage, IMAGE_SLOTS, type ImageSlotKey } from "@/lib/itinerary-images";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/itinerary");

export async function GET() {
  const images = getImageMap();
  return NextResponse.json({ images, slots: IMAGE_SLOTS });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const slot = formData.get("slot") as string;
  const file = formData.get("file") as File | null;

  const validSlots = IMAGE_SLOTS.map((s) => s.key);
  if (!validSlots.includes(slot as ImageSlotKey)) {
    return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Ensure upload dir exists
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  // Get file extension
  const ext = file.name.split(".").pop() || "webp";
  const filename = `${slot}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  // Write file
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  const publicPath = `/uploads/itinerary/${filename}`;
  setSlotImage(slot as ImageSlotKey, publicPath);

  return NextResponse.json({ success: true, path: publicPath });
}

export async function DELETE(req: NextRequest) {
  const { slot } = await req.json();

  const validSlots = IMAGE_SLOTS.map((s) => s.key);
  if (!validSlots.includes(slot as ImageSlotKey)) {
    return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
  }

  // Delete the file if it exists
  const dir = fs.readdirSync(UPLOAD_DIR).filter((f) => f.startsWith(`${slot}.`));
  for (const f of dir) {
    fs.unlinkSync(path.join(UPLOAD_DIR, f));
  }

  resetSlotImage(slot as ImageSlotKey);
  return NextResponse.json({ success: true });
}
