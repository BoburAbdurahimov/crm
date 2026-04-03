import { NextResponse } from "next/server";
import { createLead } from "@/lib/data-service";

// Handle CORS for the landing page
const getCorsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": "*", // In production restrict to your actual landing page domain
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
});

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.fullName || !body.email) {
      return NextResponse.json(
        { error: "Full Name and Email are required fields." },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    // Create the lead
    const newLead = createLead({
      fullName: body.fullName,
      companyName: body.companyName,
      email: body.email,
      phone: body.phone,
      serviceRequested: body.serviceRequested,
      estimatedBudget: body.estimatedBudget ? Number(body.estimatedBudget) : undefined,
      inquiryMessage: body.message,
      source: body.source || "Landing Page",
    });

    return NextResponse.json(
      { success: true, message: "Lead created successfully", data: newLead },
      { status: 201, headers: getCorsHeaders(origin) }
    );
  } catch (error) {
    console.error("Error creating incoming lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: getCorsHeaders(request.headers.get("origin")) }
    );
  }
}
