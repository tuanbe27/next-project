import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const getPage = req.nextUrl.searchParams.get("page");
  const getLimit = req.nextUrl.searchParams.get("limit");

  const page = getPage ? parseInt(getPage, 10) : 1;
  const limit = getLimit ? parseInt(getLimit, 10) : 10;
  const skip = (page - 1) * limit;

  const feedbacks = await prisma.feedback.findMany({
    skip,
    take: limit,
  });

  const res = {
    status: "success",
    count: feedbacks.length,
    data: feedbacks,
  };

  return NextResponse.json(res);
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    const feedback = await prisma.feedback.create({ data: json });

    const res = {
      status: "success",
      data: {
        feedback,
      },
    };

    return new NextResponse(JSON.stringify(res), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      let errMsg = {
        status: "fail",
        message: "Feedback with title already exists",
      };
      return new NextResponse(JSON.stringify(errMsg), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    let errMsg = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(errMsg), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
