// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
// IMPORT the working connection from your lib folder
// Note: We go up two levels (../../) to get out of api/checkout/
import { supabase } from '@/lib/supabaseClient'; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cart } = body;

    // Validate input
    if (!cart || !Array.isArray(cart)) {
      return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 });
    }

    // Process each bundle in the cart
    for (const bundle of cart) {
      for (const item of bundle.items) {
        // Handle potential ID differences
        const productId = item.product_id || item.id;
        const quantityToBuy = item.quantity;

        // 1. Get current stock
        // We use the 'supabase' client we imported from your lib folder
        const { data: product, error: fetchError } = await supabase
          .from('products')
          .select('quantity')
          .eq('product_id', productId) 
          .single();

        if (fetchError || !product) {
          console.error(`Product ${productId} not found or error:`, fetchError);
          continue; 
        }

        // 2. Calculate new stock
        const newStock = Math.max(0, product.quantity - quantityToBuy);

        // 3. Update Supabase
        const { error: updateError } = await supabase
          .from('products')
          .update({ quantity: newStock })
          .eq('product_id', productId);

        if (updateError) {
          console.error(`Failed to update stock for ${productId}:`, updateError);
          throw new Error('Database update failed');
        }
      }
    }

    return NextResponse.json({ message: 'Stock updated successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}