import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  createAccessToken,
  createRefreshToken,
  setRefreshTokenCookie,
} from "@/lib/auth";
import { verifyOtp } from "@/lib/otp";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, code } = await req.json();
  const valid = await verifyOtp(email, code);

  if (!valid) {
    return NextResponse.json(
      { error: "Invalid or expired OTP" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "No user" }, { status: 404 });
  }

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);
  setRefreshTokenCookie(refreshToken);

  return NextResponse.json({ accessToken });
}
