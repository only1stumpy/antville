import { NextResponse } from "next/server";

import { createBuilding } from "@/lib/buildings";
import { parseMaterials } from "@/lib/materials";

const fileToDataUrl = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}`;
};

export async function POST(request: Request) {
  const formData = await request.formData();

  const name = String(formData.get("name") ?? "").trim();
  const x = String(formData.get("x") ?? "").trim();
  const y = String(formData.get("y") ?? "").trim();
  const z = String(formData.get("z") ?? "").trim();

  const schematic = formData.get("schematic") as File | null;
  const materialsFile = formData.get("materials") as File | null;
  const screenshotFile = formData.get("screenshot") as File | null;

  if (!name || !x || !y || !z || !schematic || !materialsFile) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const materialsText = await materialsFile.text();
  const materials = parseMaterials(materialsText);
  const screenshotDataUrl = screenshotFile
    ? await fileToDataUrl(screenshotFile)
    : null;

  const record = createBuilding({
    name,
    coordinates: { x, y, z },
    schematicFileName: schematic.name,
    materialsFileName: materialsFile.name,
    screenshotDataUrl,
    materials,
  });

  return NextResponse.json({ id: record.id });
}
