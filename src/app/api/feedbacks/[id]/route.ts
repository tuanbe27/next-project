import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const feedback = await prisma.feedback.findUnique({ where: { id } });

  if (!feedback) {
    let errMsg = {
      status: "fail",
      message: "No Feedback with the Provided ID Found",
    };
    return new NextResponse(JSON.stringify(errMsg), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const res = {
    status: "success",
    data: {
      feedback,
    },
  };
  return NextResponse.json(res);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const bodyData = await request.json();

    const updated_data = await prisma.feedback.update({
      where: { id },
      data: bodyData,
    });

    const res = {
      status: "success",
      data: {
        feedback: updated_data,
      },
    };
    return NextResponse.json(res);
  } catch (error: any) {
    if (error.code === "P2025") {
      const errMsg = {
        status: "fail",
        message: "No Feedback with the Provided ID Found",
      };
      return new NextResponse(JSON.stringify(errMsg), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const errMsg = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(errMsg), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await prisma.feedback.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === "P2025") {
      const errMsg = {
        status: "fail",
        message: "No Feedback with the Provided ID Found",
      };
      return new NextResponse(JSON.stringify(errMsg), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const errMsg = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(errMsg), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
