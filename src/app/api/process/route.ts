import { process } from "@/api";
import { NextResponse } from "next/server";

// no cache
export const maxAge = 0;
export const revalidate = 0;

export async function GET() {
  await process();
  return NextResponse.json({
    stats: "done",
  }, {
    status: 200,
  });
}