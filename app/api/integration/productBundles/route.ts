import { NextRequest, NextResponse } from "next/server";
import { getProducts, deductBundleStock } from "@/lib/services/crudService";

export interface IProductBundle {
  id?: string;
  name?: string;
  products: { product_id: string; quantity: number }[];
}

export async function GET() {
  try {
    const data = await getProducts();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body: IProductBundle = await req.json();
  try {
    await deductBundleStock(body.products);
    return NextResponse.json({ message: "Products updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
