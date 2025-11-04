import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getProjectWithSecrets } from '@/lib/data';
import { createGhostSubscriptionService } from '@/lib/ghost-admin';

// Validation schema for subscription request
const SubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  prefix: z.string().min(1, 'Project prefix is required'),
  labels: z.array(z.string()).optional(),
});

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const body = await request.json()
    
    // Validate request data
    const validatedData = SubscribeSchema.parse(body);
    
    // Get project information with secrets (server-side only)
    const project = await getProjectWithSecrets(validatedData.prefix);
    
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Check if project has Ghost Admin API key
    if (!project.ghost_admin_key) {
      return NextResponse.json(
        { success: false, message: 'Subscription not available for this project' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Create Ghost subscription service
    const subscriptionService = createGhostSubscriptionService(
      project.ghost_domain,
      project.ghost_admin_key
    );

    // Subscribe user
    const result = await subscriptionService.subscribe({
      email: validatedData.email,
      name: validatedData.name,
      labels: validatedData.labels,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      }, { headers: corsHeaders });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Subscription API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid request data',
          errors: error.errors 
        },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Optional: Handle unsubscribe requests
export async function DELETE(request: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const prefix = searchParams.get('prefix');

    if (!email || !prefix) {
      return NextResponse.json(
        { success: false, message: 'Email and project prefix are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get project information with secrets (server-side only)
    const project = await getProjectWithSecrets(prefix);
    
    if (!project || !project.ghost_admin_key) {
      return NextResponse.json(
        { success: false, message: 'Project not found or subscription not available' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Create Ghost subscription service
    const subscriptionService = createGhostSubscriptionService(
      project.ghost_domain,
      project.ghost_admin_key
    );

    // Unsubscribe user
    const result = await subscriptionService.unsubscribe(email);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      }, { headers: corsHeaders });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Unsubscribe API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
