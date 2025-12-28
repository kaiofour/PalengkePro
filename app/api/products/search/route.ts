import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  let query = supabase
    .from("products")
    .select("product_id,product_name,supplier,price,quantity")
    .order("product_name", { ascending: true })
    .limit(5);

  // If user typed something, filter by name
  if (q.length > 0) {
    query = query.ilike("product_name", `%${q}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? [], { status: 200 });
}
