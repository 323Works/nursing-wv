import { NextResponse } from "next/server";
import { searchLicensees } from "@/lib/queries";
import { parseFilters } from "@/lib/filters";
import { allowRequest } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allowRequest(forwarded)) return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });

  try {
    const filters = parseFilters(await request.json());
    return NextResponse.json(await searchLicensees(filters));
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid search request." }, { status: 400 });
    }
    console.error("License search failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to load records right now." }, { status: 500 });
  }
}
