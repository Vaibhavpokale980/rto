// app/api/auth/get-applications/route.js

import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Application from "@/app/models/applications";

export async function GET(req) {
  await connectDB();

  try {
    // Fetch all applications from the database
    const applications = await Application.find();

    // Return the applications
    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// Configure API route options
export const config = {
  api: {
    bodyParser: false,  // Ensure the body parser is disabled
  },
};
