import { NextResponse } from "next/server";
import { sendMessage, getMessages } from "@/lib/messages";

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer pt_")) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Invalid API key" } },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "invalid_json", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const { to, body: msgBody, from } = body;

  if (!to || typeof to !== "string") {
    return NextResponse.json(
      { error: { code: "missing_to", message: "'to' field is required" } },
      { status: 400 }
    );
  }

  if (!msgBody || typeof msgBody !== "string") {
    return NextResponse.json(
      { error: { code: "missing_body", message: "'body' field is required" } },
      { status: 400 }
    );
  }

  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phoneRegex.test(to)) {
    return NextResponse.json(
      { error: { code: "invalid_phone", message: "Phone number must be in E.164 format" } },
      { status: 400 }
    );
  }

  const msg = sendMessage(to, msgBody, from);
  return NextResponse.json(msg);
}

export async function GET() {
  return NextResponse.json({ messages: getMessages() });
}
