export interface Message {
  id: string;
  status: "queued" | "sent" | "delivered" | "failed";
  to: string;
  body: string;
  from: string | null;
  createdAt: string;
  deliveredAt: string | null;
}

const messages: Message[] = [];

export function sendMessage(to: string, body: string, from?: string): Message {
  const msg: Message = {
    id: `msg_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    status: "queued",
    to,
    body,
    from: from ?? null,
    createdAt: new Date().toISOString(),
    deliveredAt: null,
  };
  messages.push(msg);

  setTimeout(() => {
    msg.status = "sent";
  }, 300);
  setTimeout(() => {
    msg.status = "delivered";
    msg.deliveredAt = new Date().toISOString();
  }, 1500);

  return msg;
}

export function getMessage(id: string): Message | undefined {
  return messages.find((m) => m.id === id);
}

export function getMessages(): Message[] {
  return [...messages].reverse();
}

export function getStats() {
  return {
    total: messages.length,
    delivered: messages.filter((m) => m.status === "delivered").length,
    failed: messages.filter((m) => m.status === "failed").length,
    queued: messages.filter((m) => m.status === "queued" || m.status === "sent").length,
  };
}
