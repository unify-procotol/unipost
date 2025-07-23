import { NextRequest, NextResponse } from 'next/server';
import { getProjectWithSecrets } from '@/lib/data';
import { createGhostSubscriptionService } from '@/lib/ghost-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const prefix = searchParams.get('prefix');

    if (!email || !prefix) {
      return NextResponse.json(
        { success: false, message: 'Email and project prefix are required' },
        { status: 400 }
      );
    }

    // Get project information with secrets (server-side only)
    const project = await getProjectWithSecrets(prefix);
    
    if (!project || !project.ghost_admin_key) {
      return NextResponse.json(
        { subscribed: false },
        { status: 200 }
      );
    }

    // Create Ghost subscription service
    const subscriptionService = createGhostSubscriptionService(
      project.ghost_domain,
      project.ghost_admin_key
    );

    // Check subscription status
    const result = await subscriptionService.checkSubscription(email);

    return NextResponse.json({
      subscribed: result.subscribed,
      member: result.member || null,
    });
  } catch (error) {
    console.error('Check subscription API error:', error);
    return NextResponse.json(
      { subscribed: false },
      { status: 200 }
    );
  }
}
