import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/services/crudService";

export async function GET(req: NextRequest) {
  const q = (new URL(req.url).searchParams.get("q") || "").trim();
  try {
    const data = await searchProducts(q);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
