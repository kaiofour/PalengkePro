import { NextRequest, NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/services/crudService";

export async function POST(req: NextRequest) {
  const { ids } = await req.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const data = await getProductsByIds(ids);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
