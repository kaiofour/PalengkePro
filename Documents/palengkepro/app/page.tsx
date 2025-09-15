import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import { IProduct } from "@/types/product";
import { supabase } from "@/lib/supabaseClient";

export default async function Home() {
  // Fetch products from Supabase
  const { data: products, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Error fetching products:", error.message);
  }

  return (
    <main className="max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">Inventory Dashboard</h1>

      {/* Add product button & form */}
      <AddProduct />

      {/* Product list */}
      <div className="mt-6">
        {products && products.length > 0 ? (
          <ProductList products={products as IProduct[]} />
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
    </main>
  );
}
