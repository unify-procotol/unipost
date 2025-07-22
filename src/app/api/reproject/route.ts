import { NextResponse } from "next/server";
import { ProjectAdapter } from "@/adapters/project";

export async function POST(request: Request) {
  const body = await request.json();
  const projectAdapter = new ProjectAdapter();
  const project = await projectAdapter.create({
    data: {
      uid: body.uid,
      name: body.name,
      prefix: body.prefix,
      ghost_api_key: body.ghost_api_key,
      ghost_admin_key: body.ghost_admin_key,
      ghost_domain: body.ghost_domain,
      locales: body.locales,
      rule: body.rule,
    },
  });
  return NextResponse.json({
    project,
  });
}