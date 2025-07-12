import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendOtpEmail } from "@/lib/email"; // Make sure this path is correct
import { generateOtp, saveOtpToDb } from "@/lib/otp";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email } });
    }

    const otp = generateOtp();
    await saveOtpToDb(user.id, otp);

    await sendOtpEmail(email, otp);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LOGIN API ERROR:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
