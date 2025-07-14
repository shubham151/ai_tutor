import { Completion } from "./Completion";
import { marked } from "marked";
import type {
  message,
  onErrorCallback,
  onUpdateCallback,
  role,
  roles,
} from "@/app/types";

const ROLES: roles = {
  user: "user",
  assistant: "assistant",
};

const INTRO = "Hello! How can I help you today?";
const UNDEFINED_CALLBACK = "onUpdateCallback is undefined";

let messages: message[] = [];
let onUpdateCallback: onUpdateCallback;

async function processMessages(
  context: message[],
  onErrorCallback: onErrorCallback
) {
  if (!onUpdateCallback) throw new Error(UNDEFINED_CALLBACK);

  // Create a mutable localMessages
  let localMessages = [...context, { role: ROLES.assistant, content: "" }];
  onUpdateCallback([...localMessages], true);

  try {
    await Completion.get(context, (chunk: string) => {
      const html = marked(chunk);

      const last = localMessages[localMessages.length - 1];
      const updated = { ...last, content: last.content + html };

      localMessages = [...localMessages.slice(0, -1), updated];

      onUpdateCallback([...localMessages], true);
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error occurred";
    onErrorCallback?.(msg);
  }

  onUpdateCallback([...localMessages], false);
  messages = [...localMessages]; // commit after streaming
}

async function send(content: string, onErrorCallback: onErrorCallback) {
  if (!onUpdateCallback) throw new Error(UNDEFINED_CALLBACK);

  messages = [...messages, { role: ROLES.user, content }];
  onUpdateCallback([...messages], true);
  await processMessages(messages, onErrorCallback);
}

function onUpdate(callback: onUpdateCallback) {
  if (!callback) throw new Error(UNDEFINED_CALLBACK);

  if (!messages.length) {
    messages = [...messages, { role: ROLES.assistant, content: INTRO }];
  }

  onUpdateCallback = callback;
  onUpdateCallback([...messages], false);
}

export const Message = { onUpdate, send };
