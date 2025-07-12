import { NextResponse } from "next/server";
import { clearRefreshTokenCookie } from "@/lib/auth";

export async function POST() {
  clearRefreshTokenCookie();
  return NextResponse.json({ success: true });
}
