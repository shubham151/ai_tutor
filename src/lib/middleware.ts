import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "./auth";

export function authMiddleware(handler: (req: NextRequest, userId: string) => Promise<Response>) {
  return async (req: NextRequest) => {
    const userId = getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(req, userId);
  };
}
