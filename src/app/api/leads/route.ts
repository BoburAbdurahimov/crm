import { NextResponse } from "next/server";
import { getLeads, createLead } from "@/lib/data-service";
import { LeadStatus } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as LeadStatus | undefined;
    const source = searchParams.get("source") || undefined;
    const search = searchParams.get("search") || undefined;
    const unreadParam = searchParams.get("unread");
    
    const unread = unreadParam ? unreadParam === "true" : undefined;
    
    const leads = getLeads({ status, source, search, unread });
    
    return NextResponse.json({ success: true, data: leads }, { status: 200 });
  } catch (error) {
    console.error("GET Leads error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.fullName || !body.email) {
      return NextResponse.json(
        { error: "Full Name and Email are required fields." },
        { status: 400 }
      );
    }
    
    const newLead = createLead(body);
    
    return NextResponse.json({ success: true, data: newLead }, { status: 201 });
  } catch (error) {
    console.error("POST Lead error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
