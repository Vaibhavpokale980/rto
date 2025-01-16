import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Application from "@/app/models/applications";

export async function POST(req) {
  await connectDB();

  try {
    // Parse JSON request body
    const formData = await req.json();

    // Validate and transform data
    const { service, doneDate, status, registerid } = formData;

    if (!service || !doneDate || !status || !registerid) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // let d=new Date(doneDate);
    console.log(doneDate," mmmmmmmmmmmmmmmmmmmmmmmmm")
    // Convert `doneDate` to a Date object
    const applicationDetails = new Application({
      service,
      doneDate: new Date(doneDate), // Convert string to Date
      status,
      registerid: registerid, // Correct key for the schema
    });

    
    // Save to the database
    await applicationDetails.save();
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

    return NextResponse.json(
      { message: "Application details saved successfully!" },
      { status: 200 }
    );
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
    bodyParser: false,
  },
};
