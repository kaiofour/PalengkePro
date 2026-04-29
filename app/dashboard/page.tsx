"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getUser, signOut } from "@/lib/services/authService";
import { getProducts } from "@/lib/services/crudService";
import AddProduct from "../components/AddProduct";
import ProductList from "../components/ProductList";
import { IProduct } from "@/types/product";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const router = useRouter();

  const refreshProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error: any) {
      console.error("Error fetching products:", error.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      const currentUser = await getUser();
      if (currentUser) {
        setUser(currentUser);
        await refreshProducts();
      } else {
        router.push("/login");
      }
    };
    init();
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
        {user && (
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <AddProduct refreshProducts={refreshProducts} />

      <div className="mt-6">
        {products && products.length > 0 ? (
          <ProductList products={products} refreshProducts={refreshProducts} />
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
}
