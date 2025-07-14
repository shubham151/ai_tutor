import { Api } from "@/app/core/Api";

async function get(
  messages: any,
  onChunk: (chunk: string) => void
): Promise<void> {
  const { reader, error } = await Api.streamPost("completion", { messages });
  if (error || !reader) return;

  const decoder = new TextDecoder("utf-8");
  let done = false;

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    done = streamDone;

    const chunk = decoder.decode(value, { stream: true });

    if (chunk.trim()) {
      onChunk(chunk);
    }
  }
}

export const Completion = { get };
