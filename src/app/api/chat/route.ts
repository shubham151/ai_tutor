import { NextRequest } from "next/server";
import { Gemini } from "@/lib/gemini";
import { pdfContextStore } from "@/app/api/pdf-context/store";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  const { prompt, fileName } = await req.json();
  const userId = "3592a1f6-a1e5-4951-bc2a-e7ad54800704";

  const pages = pdfContextStore[fileName];
  if (!pages) {
    return new Response("PDF context not found", { status: 404 });
  }

  const pdf = await prisma.pdfFile.findUnique({
    where: { hash: fileName },
  });

  if (!pdf) {
    return new Response("PDF not found in DB", { status: 404 });
  }

  const conversation = await prisma.conversation.create({
    data: {
      userId,
      pdfId: pdf.id,
    },
  });

  await prisma.message.create({
    data: {
      role: "user",
      content: prompt,
      conversationId: conversation.id,
    },
  });

  const pageContext = pages
    .slice(0, 5)
    .map((p) => `Page ${p.page}: ${p.text}`)
    .join("\n\n");

  const messages = [
    {
      role: "system",
      content: `You are a helpful assistant for answering questions about PDF documents.\n\nUse the provided extracted text (from a PDF) to answer.\n\nAlways respond in this strict JSON format:\n\n{\n  "content": "<the full answer text>",\n  "highlight": {\n    "page": <page number>,\n    "rect": {\n      "x": <number>,\n      "y": <number>,\n      "width": <number>,\n      "height": <number>\n    }\n  }\n}\n\nIf no highlight is needed, omit the "highlight" field.`,
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
    userId,
    "default"
  );

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let raw = "";

  if (reader) {
    let done = false;
    while (!done) {
      const { value, done: isDone } = await reader.read();
      done = isDone;
      raw += decoder.decode(value, { stream: true });
    }

    try {
      const parsed = JSON.parse(raw.trim());
      await prisma.message.create({
        data: {
          role: "assistant",
          content: parsed.content,
          conversationId: conversation.id,
          highlight: parsed.highlight ? parsed.highlight : undefined,
        },
      });
    } catch (err) {
      console.warn("⚠️ Could not parse streamed JSON:", raw);
    }
  }

  return response; // Still return stream to client
}
