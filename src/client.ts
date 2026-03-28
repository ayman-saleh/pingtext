interface SendMessageParams {
  to: string;
  body: string;
  from?: string;
}

interface Message {
  id: string;
  status: "queued" | "sent" | "delivered" | "failed";
  to: string;
  body: string;
  from: string | null;
  createdAt: string;
  deliveredAt: string | null;
}

interface PingTextError {
  error: {
    code: string;
    message: string;
  };
}

export class PingText {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, options?: { baseUrl?: string }) {
    this.apiKey = apiKey;
    this.baseUrl = options?.baseUrl ?? "https://api.pingtext.dev";
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      const err = data as PingTextError;
      throw new Error(
        `PingText API error: ${err.error?.message ?? res.statusText}`
      );
    }

    return data as T;
  }

  messages = {
    send: (params: SendMessageParams): Promise<Message> => {
      return this.request<Message>("POST", "/v1/messages", params);
    },

    get: (messageId: string): Promise<Message> => {
      return this.request<Message>("GET", `/v1/messages/${messageId}`);
    },
  };
}

export default PingText;
