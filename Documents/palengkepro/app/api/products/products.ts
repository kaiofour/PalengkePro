// api/products.ts
import { supabase } from "@/lib/supabaseClient"
import { IProduct } from "@/types/product"

// ✅ Get all products
export const getProducts = async (): Promise<IProduct[]> => {
  const { data, error } = await supabase.from("products").select("*")
  if (error) throw error
  return data || []
}

// ✅ Add a product
export const addProduct = async (product: IProduct) => {
  const { data, error } = await supabase.from("products").insert([product])
  if (error) throw error
  return data
}

// ✅ Edit product
export const editProduct = async (product: IProduct) => {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", product.id)
  if (error) throw error
  return data
}

// ✅ Delete product
export const deleteProduct = async (id: string) => {
  const { data, error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw error
  return data
}
