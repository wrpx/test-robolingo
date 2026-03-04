import { NextResponse } from "next/server";
import { messages } from "../webhook/route";

export async function GET() {
  return NextResponse.json({ messages });
}
