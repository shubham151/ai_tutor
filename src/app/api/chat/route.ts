import { NextRequest } from "next/server";
import { Gemini } from "@/lib/gemini";
import { pdfContextStore } from "@/app/api/pdf-context/store";

export async function POST(req: NextRequest) {
  const { prompt, fileName, userId } = await req.json();
  const pages = pdfContextStore[fileName];

  if (!pages) {
    return new Response("PDF context not found", { status: 404 });
  }

  const pageContext = pages
    .slice(0, 5)
    .map((p) => `Page ${p.page}: ${p.text}`)
    .join("\n\n");

  const messages = [
    {
      role: "system",
      content: `You are a helpful assistant for answering questions about PDF documents.

Use the provided extracted text (from a PDF) to answer.

Always respond in this strict JSON format:

{
  "content": "<the full answer text>",
  "highlight": {
    "page": <page number>,
    "rect": {
      "x": <number>,
      "y": <number>,
      "width": <number>,
      "height": <number>
    }
  }
}

If no highlight is needed, omit the "highlight" field.

DO NOT include markdown or explanation. ONLY return raw JSON.`,
    },
    {
      role: "user",
      content: `PDF Content:\n\n${pageContext}`,
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const response = await Gemini.getCompletions(
    { messages },
    userId ?? "anon",
    "default"
  );

  return response;
}
