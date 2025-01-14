import connectDB from '@/app/lib/db'; // Ensure you have a dbConnect utility to connect to MongoDB
import User from '@/app/models/User'; // Adjust the path based on your project structure
import UserDetails from '@/app/models/UserDetails'; // Adjust the path based on your project structure
import { NextResponse } from 'next/server'; // Import the NextResponse object

// Named export for GET handler
export async function GET(req) {
    try {
        // Use req.nextUrl.searchParams to access query parameters in Next.js 13
        const id = req.nextUrl.searchParams.get('id');

        console.log(id);

        if (!id) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        // Fetch user details from the UserDetails collection based on userId
        const userDetails = await UserDetails.findOne({ userId: id });
        if (!userDetails) {
            return NextResponse.json({ message: 'User details not found' }, { status: 404 });
        }

        // Fetch the user info from the User collection based on _id
        const user = await User.findById(id).exec();
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Combine the user info and user details
        const userData = {
            name: user.name,
            email: user.email,
            position: userDetails.position,
        };

        return NextResponse.json(userData, { status: 200 }); // Return the user data as response
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
