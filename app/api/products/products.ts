// api/products.ts
import { supabase } from "../../../lib/supabaseClient"
import { IProduct } from "@/types/product"

//  Get all products
export const getProducts = async (): Promise<IProduct[]> => {
  const { data, error } = await supabase.from("products").select("*")
  if (error) {
  console.error("Supabase error in getProducts:", error);
  throw new Error(error.message); // throw a string, not the object
  }

  return data || []
}

//  Add a product
export const addProduct = async (product: IProduct) => {
  const { data, error } = await supabase.from("products").insert([product])
  if (error) {
  console.error("Supabase error in getProducts:", error);
  throw new Error(error.message); 
  }

  return data
}

// Edit product
export const editProduct = async (product: IProduct) => {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("product_id", product.product_id)
  if (error) {
  console.error("Supabase error in getProducts:", error);
  throw new Error(error.message); // throw a string, not the object
  }

  return data
}

// Delete product
export const deleteProduct = async (product_id: string) => {
  const { data, error } = await supabase
  .from("products")
  .delete()
  .eq("product_id", product_id)
  if (error) {
  console.error("Supabase error in getProducts:", error);
  throw new Error(error.message); // throw a string, not the object
  }

  return data
}


//===================MANAGING PRODUCT QUANTITY===================//
// Reduce product quantity after a sale

export const reduceProductQuantity = async (product_id: number, quantity_sold: number) => {
  // Get current quantity
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("quantity")
    .eq("product_id", product_id)
    .single();

  if (fetchError) {
    console.error("Error fetching product:", fetchError);
    throw new Error(fetchError.message);
  }

  // Calculate new quantity
  const newQuantity = Math.max((product?.quantity || 0) - quantity_sold, 0); // prevent negative stock

  // Update product quantity
  const { data, error } = await supabase
    .from("products")
    .update({ quantity: newQuantity })
    .eq("product_id", product_id);

  if (error) {
    console.error("Error updating quantity:", error);
    throw new Error(error.message);
  }

  return data;
};