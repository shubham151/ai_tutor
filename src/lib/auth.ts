import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN!;
const SECRET_REFRESH_TOKEN = process.env.SECRET_REFRESH_TOKEN!;

export function createAccessToken(userId: string) {
  return jwt.sign({ id: userId }, SECRET_ACCESS_TOKEN, { expiresIn: "15m" });
}

export function createRefreshToken(userId: string) {
  return jwt.sign({ id: userId }, SECRET_REFRESH_TOKEN, { expiresIn: "2y" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_ACCESS_TOKEN) as { id: string };
  } catch {
    return null;
  }
}

export async function setRefreshTokenCookie(token: string) {
  (await cookies()).set("refresh-token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function clearRefreshTokenCookie() {
  (await cookies()).delete("refresh-token");
}
