import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";

export async function POST(req) {
  await connectDB();

  const { name, email, password } = await req.json();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
