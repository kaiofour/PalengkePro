import { NextResponse } from "next/server";
import { deductStock } from "@/lib/services/crudService";

export async function POST(request: Request) {
  try {
    const { cart } = await request.json();

    if (!cart || !Array.isArray(cart)) {
      return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
    }

    for (const bundle of cart) {
      for (const item of bundle.items) {
        await deductStock(item.product_id || item.id, item.quantity);
      }
    }

    return NextResponse.json({ message: "Stock updated successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
