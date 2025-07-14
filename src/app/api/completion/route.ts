import { Gemini } from "@/lib/chat/gemini";

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const userId = "user"; // optionally replace with real user id logic
  const modelKey = "gemini"; // or dynamic model selector

  return await Gemini.getCompletions(body, userId, modelKey);
}
