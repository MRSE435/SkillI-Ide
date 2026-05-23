import { NextResponse } from "next/server";

import { connectDB } from "@/app/lib/db";
import Project from "@/app/models/Project";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { title, files, dependencies } = body;

    const project = await Project.create({
      title,
      files,
      dependencies,
    });

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}