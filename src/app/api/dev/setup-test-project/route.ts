import { NextResponse } from "next/server";
import { ProjectAdapter } from "@/adapters/project";
import { sanitizeProject, sanitizeProjects } from "@/lib/data-sanitizer";

// This is a development-only endpoint to create a test project with subscription enabled
export async function POST() {
  try {
    const projectAdapter = new ProjectAdapter();

    // Check if test project already exists
    let existingProject;
    try {
      existingProject = await projectAdapter.findOne({
        where: { prefix: "testblog" }
      });
    } catch {
      // Project doesn't exist, continue with creation
      existingProject = null;
    }

    if (existingProject) {
      return NextResponse.json({
        success: true,
        message: "Test project already exists",
        project: sanitizeProject(existingProject),
        note: "Visit: http://localhost:3000/project/testblog/en"
      });
    }

    // Create a test project with Ghost Admin API key
    const testProject = await projectAdapter.create({
      data: {
        uid: 1,
        name: "Test Blog with Subscription",
        prefix: "testblog",
        ghost_api_key: "test_content_api_key",
        ghost_admin_key: "test_admin_api_key_12345", // This enables subscription features
        ghost_domain: "https://demo.ghost.io",
        locales: ["en", "zh", "es"],
        rule: "test",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Test project created successfully",
      project: sanitizeProject(testProject),
      note: "Visit: http://localhost:3000/project/testblog/en to see the subscription button"
    });
  } catch (error) {
    console.error('Error creating test project:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to create test project",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Get all projects for debugging
export async function GET() {
  try {
    const projectAdapter = new ProjectAdapter();
    const projects = await projectAdapter.findMany({});
    
    return NextResponse.json({
      success: true,
      projects: sanitizeProjects(projects),
      count: projects.length,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch projects",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
