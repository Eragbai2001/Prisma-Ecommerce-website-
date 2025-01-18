// app/api/banners/route.ts - for the main banners endpoint
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const banner = await prisma.banner.create({
      data: {
        label: body.label,
        image: body.image,
        categories: {
          connect: body.categories.map((categoryId: string) => ({ id: categoryId })),
        },
      },
    });
    
    return NextResponse.json(banner);
  } catch (error) {
    console.log("[BANNERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      include: {
        categories: true,
      },
    });
    
    return NextResponse.json(banners);
  } catch (error) {
    console.log("[BANNERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}