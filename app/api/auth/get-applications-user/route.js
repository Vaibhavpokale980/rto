import connectDB from "@/app/lib/db";
import BookAppointment from "@/app/models/appointment";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; // Import cookies to access cookies in Next.js
import { NextResponse } from "next/server"; // Import NextResponse

export async function GET(req) {
    await connectDB();
    
    try {
        // Get the token from cookies using next/headers
        const cookieStore = cookies();
        const token = cookieStore.get('token'); // Adjusted to Next.js 13 cookie handling
        console.log(token);

        // If token is not found, return unauthorized response
        if (!token) {
            return NextResponse.json(
                { success: false, message: "Token not found" },
                { status: 401 }
            );
        }

        // Verify the token and extract the user id (registerid)
        let decoded;
        try {
            decoded = jwt.verify(token.value, process.env.JWT_SECRET); // Verify the JWT token using the secret
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 401 }
            );
        }

        const registerid = decoded.id; // The decoded ID is the registerid (user._id from the token)

        // Fetch appointments that match the registerid
        const appointments = await BookAppointment.find({ registerid });

        if (!appointments || appointments.length === 0) {
            return NextResponse.json(
                { success: false, message: "No appointments found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: appointments },
            { status: 200 }
        );

    } catch (error) {
        console.error(error); // Log the error for debugging
        return NextResponse.json(
            { success: false, message: error.message || "An error occurred" },
            { status: 500 }
        );
    }
}
