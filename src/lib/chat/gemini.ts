import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Stream } from "./stream";
import { streamText } from "ai";

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = "gemini-2.5-flash-preview-04-17";

async function getCompletions(
  messageObject: any,
  userId: string,
  modelKey: string
): Promise<Response> {
  const messages = messageObject.messages;
  const model = google(MODEL_NAME);
  const result = streamText({
    model,
    messages,
  });
  const response = Stream.get(result.textStream);
  return response;
}

export const Gemini = { getCompletions };
