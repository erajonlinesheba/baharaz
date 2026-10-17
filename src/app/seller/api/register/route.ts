import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if(!name || !email || !password){
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    // আপাতত DB নাই তাই LocalStorage এ Save করতেছি
    // পরে DB লাগলে এখানে Prisma/MongoDB Code লিখবা
    const seller = { name, email, password };
    
    return NextResponse.json({ 
      message: "Seller Created Successfully", 
      seller 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}