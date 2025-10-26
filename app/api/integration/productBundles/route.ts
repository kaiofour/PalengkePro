// api/productBundles/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export interface IProductBundle {
  id?: string;
  name?: string;
  products: { product_id: string; quantity: number }[];
}

// GET all products
export async function GET() {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST: decrease product quantities when a bundle is requested
export async function POST(req: NextRequest) {
  const body: IProductBundle = await req.json();

  try {
    for (const item of body.products) {
      // Fetch current quantity without using .single()
      const { data: productDataArray, error: prodError } = await supabase
        .from("products")
        .select("quantity")
        .eq("product_id", item.product_id);

      if (prodError) throw new Error(prodError.message);

      if (!productDataArray || productDataArray.length === 0)
        throw new Error(`Product ID ${item.product_id} not found`);

      const productData = productDataArray[0];

      if (productData.quantity < item.quantity)
        throw new Error(
          `Insufficient quantity for product ID ${item.product_id}`
        );

      // Update product quantity
      const { error: updateError } = await supabase
        .from("products")
        .update({ quantity: productData.quantity - item.quantity })
        .eq("product_id", item.product_id);

      if (updateError) throw new Error(updateError.message);
    }

    return NextResponse.json({ message: "Products updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
