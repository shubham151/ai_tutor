import { NextRequest, NextResponse } from "next/server";
import { pdfContextStore } from "./store";

export async function POST(req: NextRequest) {
  const { fileName, pages } = await req.json();
  if (!fileName || !Array.isArray(pages)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  pdfContextStore[fileName] = pages;
  return NextResponse.json({ success: true });
}
