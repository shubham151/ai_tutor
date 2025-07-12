import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function generateOtp(length = 6): string {
  return Array.from({ length })
    .map(() => Math.floor(Math.random() * 10))
    .join("");
}

export async function saveOtpToDb(userId: string, otp: string) {
  await prisma.userOtp.deleteMany({ where: { userId } });

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  await prisma.userOtp.create({
    data: {
      userId,
      code: otp,
      expiresAt,
    },
  });
}

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return false;

  const otp = await prisma.userOtp.findFirst({
    where: {
      userId: user.id,
      code,
      expiresAt: { gte: new Date() },
    },
  });
  if (!otp) return false;

  await prisma.userOtp.delete({ where: { id: otp.id } });

  return true;
}
