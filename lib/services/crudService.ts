import { supabase } from "@/lib/supabaseClient";
import { IProduct } from "@/types/product";

export const getProducts = async (): Promise<IProduct[]> => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw new Error(error.message);
  return data || [];
};

export const getProductsByIds = async (ids: string[]): Promise<IProduct[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("product_id, product_name")
    .in("product_id", ids);
  if (error) throw new Error(error.message);
  return data || [];
};

export const searchProducts = async (q: string): Promise<IProduct[]> => {
  let query = supabase
    .from("products")
    .select("product_id,product_name,supplier,price,quantity")
    .order("product_name", { ascending: true })
    .limit(5);

  if (q.length > 0) {
    query = query.ilike("product_name", `%${q}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
};

export const addProduct = async (product: IProduct) => {
  const { data, error } = await supabase.from("products").insert([product]);
  if (error) throw new Error(error.message);
  return data;
};

export const editProduct = async (product: IProduct) => {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("product_id", product.product_id);
  if (error) throw new Error(error.message);
  return data;
};

export const deleteProduct = async (product_id: string) => {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("product_id", product_id);
  if (error) throw new Error(error.message);
  return data;
};

export const deductStock = async (productId: string, quantityToBuy: number) => {
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("quantity")
    .eq("product_id", productId)
    .single();

  if (fetchError || !product) throw new Error(fetchError?.message || "Product not found");

  const newStock = Math.max(0, product.quantity - quantityToBuy);

  const { error: updateError } = await supabase
    .from("products")
    .update({ quantity: newStock })
    .eq("product_id", productId);

  if (updateError) throw new Error(updateError.message);
};

export const deductBundleStock = async (
  items: { product_id: string; quantity: number }[]
) => {
  for (const item of items) {
    const { data: rows, error: fetchError } = await supabase
      .from("products")
      .select("quantity")
      .eq("product_id", item.product_id);

    if (fetchError) throw new Error(fetchError.message);
    if (!rows || rows.length === 0) throw new Error(`Product ID ${item.product_id} not found`);

    const current = rows[0];
    if (current.quantity < item.quantity)
      throw new Error(`Insufficient quantity for product ID ${item.product_id}`);

    const { error: updateError } = await supabase
      .from("products")
      .update({ quantity: current.quantity - item.quantity })
      .eq("product_id", item.product_id);

    if (updateError) throw new Error(updateError.message);
  }
};
