// api/products.ts
import { supabase } from "@/lib/supabaseClient"
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
