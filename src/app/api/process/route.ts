import { process } from "@/api";
import { NextResponse } from "next/server";

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  await process();
  return NextResponse.json({
    stats: "done",
  }, {
    status: 200,
  });
}