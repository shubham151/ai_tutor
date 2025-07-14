"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ChatPanel, {
  Message as ChatUIMessage,
} from "@/app/components/chat/ChatPanel";
import { Message as ChatCore } from "@/app/components/chat/Message";

// SSR disabled for PDF viewer
const PdfViewer = dynamic(() => import("@/app/components/pdf/PdfViewer"), {
  ssr: false,
});

export default function PdfChatLayout() {
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<ChatUIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false); // ← track init state

  // Init onUpdate once (safe guard)
  useEffect(() => {
    ChatCore.onUpdate((msgs, isLoading) => {
      setLoading(isLoading);
      setMessages((prev) => {
        console.log(
          "setMessages:",
          msgs.map((m) => m.content)
        );

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

    setReady(true); // enable sending after onUpdate is ready
  }, []);

  // Optional: Reset chat on PDF upload
  // useEffect(() => {
  //   if (file) {
  //     setMessages([]);
  //     ChatCore.reset?.(); // only if you add reset method in Message.ts
  //   }
  // }, [file]);

  // Send a user message and stream AI reply
  async function handleSend(text: string) {
    if (!ready) {
      console.warn("Chat system not initialized yet.");
      return;
    }

    ChatCore.send(text, (errMsg: string) => {
      console.error("Chat error:", errMsg);
    });
  }

  return (
    <div className="h-screen w-full flex">
      {/* LEFT: PDF upload + viewer */}
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
              <PdfViewer file={file} />
            </div>
          ) : (
            <div className="text-gray-500">Upload a PDF to get started</div>
          )}
        </div>
      </div>

      {/* RIGHT: Chat panel */}
      <div className="w-1/2 h-full flex flex-col">
        <ChatPanel messages={messages} onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
}
