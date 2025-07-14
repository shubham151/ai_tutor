"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ChatPanel, { Message as ChatUIMessage } from "@/app/components/chat/ChatPanel";
import { Message as ChatCore } from "@/app/components/chat/Message";
import { Api } from "@/app/core/Api";

// Dynamically load PDF Viewer (SSR off)
const PdfViewer = dynamic(() => import("@/app/components/pdf/PdfViewer"), {
  ssr: false,
});

export default function PdfChatLayout() {
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<ChatUIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [pdfPages, setPdfPages] = useState<{ page: number; text: string }[]>([]);
  const [ready, setReady] = useState(false);

  
function handleExtract(pages: { page: number; text: string }[]) {
  setPdfPages(pages);

  if (file) {
    Api.post("pdf-context", {
      fileName: file.name,
      pages,
    }).catch((err) => {
      console.error("Failed to send PDF context:", err);
    });
  }
}
  useEffect(() => {
    ChatCore.onUpdate((msgs, isLoading) => {
      setLoading(isLoading);
      setMessages((prev) => {
        if (prev.length !== msgs.length) {
          return msgs.map((m) => ({
            sender: m.role === "user" ? "user" : "ai",
            text: m.content,
          }));
        }
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          text: msgs[msgs.length - 1].content,
        };
        return updated;
      });
    });
    setReady(true);
  }, []);

  async function handleSend(userPrompt: string) {
    if (!ready) return;

    const selectedPages = pdfPages.slice(0, 3); // take first 3 pages for now
    const pdfContext = selectedPages.map(
      (p) => `Page ${p.page}:\n${p.text}`
    ).join("\n\n");

    const augmentedPrompt = `
You are a PDF assistant. Use the following context from the PDF:

${pdfContext}

User asks: "${userPrompt}"
Respond clearly, and if possible, specify which page the answer is from.
`;

    ChatCore.send(augmentedPrompt, (errMsg: string) => {
      console.error("Chat error:", errMsg);
    });
  }

  return (
    <div className="h-screen w-full flex">
      {/* LEFT: PDF */}
      <div className="w-1/2 border-r flex flex-col items-center justify-start p-4 bg-gray-100 h-full">
        <input
          type="file"
          accept="application/pdf"
          className="mb-4"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <div className="flex-1 w-full flex justify-center items-center">
          {file ? (
            <div className="w-full max-w-[600px]">
              <PdfViewer file={file} onExtract={handleExtract} />

            </div>
          ) : (
            <div className="text-gray-500">Upload a PDF to get started</div>
          )}
        </div>
      </div>

      {/* RIGHT: Chat */}
      <div className="w-1/2 h-full flex flex-col">
        <ChatPanel messages={messages} onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
}
