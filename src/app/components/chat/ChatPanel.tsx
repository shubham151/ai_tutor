"use client";
import { useState } from "react";

export type Message = { sender: "user" | "ai"; text: string };

interface ChatPanelProps {
  messages: Message[];
  onSend: (msg: string) => void;
  loading: boolean;
}

export default function ChatPanel({
  messages,
  onSend,
  loading,
}: ChatPanelProps) {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${m.sender === "user" ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-xl ${m.sender === "user" ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-900"}`}
            >
              {m.text}
            </span>
          </div>
        ))}
        {loading && <div className="text-gray-400">AI is thinking…</div>}
      </div>
      <form
        className="flex border-t bg-white p-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            onSend(input);
            setInput("");
          }
        }}
      >
        <input
          className="flex-1 border px-3 py-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this PDF..."
          disabled={loading}
        />
        <button
          className="ml-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
}
