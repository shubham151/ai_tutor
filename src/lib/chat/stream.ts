function get(stream: ReadableStream): Response {
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };
  return new Response(stream, { headers });
}

export const Stream = { get };
