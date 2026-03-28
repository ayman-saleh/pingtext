import express from "express";
import { randomUUID } from "crypto";

const app = express();
app.use(express.json());

interface Message {
  id: string;
  status: "queued" | "sent" | "delivered" | "failed";
  to: string;
  body: string;
  from: string | null;
  createdAt: string;
  deliveredAt: string | null;
}

const messages = new Map<string, Message>();

function authenticate(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer pt_")) {
    return res
      .status(401)
      .json({ error: { code: "unauthorized", message: "Invalid API key" } });
  }
  next();
}

app.post("/v1/messages", authenticate, (req, res) => {
  const { to, body, from } = req.body;

  if (!to || typeof to !== "string") {
    return res.status(400).json({
      error: { code: "missing_to", message: "'to' field is required" },
    });
  }

  if (!body || typeof body !== "string") {
    return res.status(400).json({
      error: { code: "missing_body", message: "'body' field is required" },
    });
  }

  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phoneRegex.test(to)) {
    return res.status(400).json({
      error: {
        code: "invalid_phone",
        message: "Phone number must be in E.164 format (e.g. +15551234567)",
      },
    });
  }

  if (body.length > 1600) {
    return res.status(400).json({
      error: {
        code: "body_too_long",
        message: "Message body must be 1600 characters or fewer",
      },
    });
  }

  const msg: Message = {
    id: `msg_${randomUUID().replace(/-/g, "").slice(0, 12)}`,
    status: "queued",
    to,
    body,
    from: from ?? null,
    createdAt: new Date().toISOString(),
    deliveredAt: null,
  };

  messages.set(msg.id, msg);

  setTimeout(() => {
    const m = messages.get(msg.id);
    if (m) m.status = "sent";
  }, 500);

  setTimeout(() => {
    const m = messages.get(msg.id);
    if (m) {
      m.status = "delivered";
      m.deliveredAt = new Date().toISOString();
    }
  }, 2000);

  res.status(200).json(msg);
});

app.get("/v1/messages/:id", authenticate, (req, res) => {
  const msg = messages.get(req.params.id);
  if (!msg) {
    return res.status(404).json({
      error: { code: "not_found", message: "Message not found" },
    });
  }
  res.status(200).json(msg);
});

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`PingText API running on http://localhost:${PORT}`);
});
