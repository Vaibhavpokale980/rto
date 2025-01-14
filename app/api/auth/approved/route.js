import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import UserDetails from '@/app/models/UserDetails';

export async function GET(req) {
  const token = req.cookies.get('token'); // Get token from the cookie
  console.log(token," mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    // Verify the token
    // console.log("aaaaaaaaaaaaaaaaaaa")
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    

    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token. User ID not found." }, { status: 401 });
    }

    const user=UserDetails.findOne({userId});
    if(!user) {
        return NextResponse.json({ error: "No User" }, { status: 401 });
    }
    const appro=UserDetails.approved;
    return NextResponse.json({ message: "User registered successfully" }, { status: 201 },{appro:true});

  }
  catch(e)
  {
    console.log(e);
  }
}