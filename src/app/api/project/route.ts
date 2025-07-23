import { NextResponse } from "next/server";
import { createProjectAction } from "@/actions/project-actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await createProjectAction({
      uid: body.uid,
      name: body.name,
      prefix: body.prefix,
      ghost_api_key: body.ghost_api_key,
      ghost_admin_key: body.ghost_admin_key,
      ghost_domain: body.ghost_domain,
      locales: body.locales,
      rule: body.rule,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      project: result.project,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}