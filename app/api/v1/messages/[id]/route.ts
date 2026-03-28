import { NextResponse } from "next/server";
import { getMessage } from "@/lib/messages";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const msg = getMessage(id);

  if (!msg) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Message not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json(msg);
}
