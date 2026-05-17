"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { FiLogOut, FiSearch, FiRefreshCw, FiPackage } from "react-icons/fi";
import { getUser, signOut } from "@/lib/services/authService";
import { getProducts } from "@/lib/services/crudService";
import AddProduct from "../components/AddProduct";
import ProductList from "../components/ProductList";
import { IProduct } from "@/types/product";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
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
      try {
        const currentUser = await getUser();

        if (!currentUser) {
          router.push("/login");
          return;
        }

        setUser(currentUser);
        await refreshProducts();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return products;

    return products.filter(
      (product) =>
        product.product_name.toLowerCase().includes(term) ||
        product.supplier.toLowerCase().includes(term)
    );
  }, [products, search]);

  return (
    <div className="min-h-screen bg-[#070b17] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(0,0,0,0.25)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.28em] text-indigo-300">
                PalengkePro
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Inventory Dashboard
              </h1>
              <p className="mt-2 text-sm text-white/65 sm:text-base">
                Manage your products, suppliers, pricing, and stock levels in one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {user && (
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
                  <span className="block text-xs uppercase tracking-wide text-white/40">
                    Logged in as
                  </span>
                  <span className="font-medium text-white">{user.email}</span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <FiSearch className="text-white/45" size={18} />
            <input
              type="text"
              placeholder="Search product name or supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={refreshProducts}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 font-medium text-white transition hover:bg-white/10"
            >
              <FiRefreshCw size={18} />
              Refresh
            </button>

            <AddProduct refreshProducts={refreshProducts} />
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/20 p-2 text-indigo-300">
              <FiPackage size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Product Inventory</p>
              <p className="text-xs text-white/50">
                Showing {filteredProducts.length} of {products.length} product(s)
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_40px_rgba(0,0,0,0.2)]">
          {loading ? (
            <div className="flex min-h-[240px] items-center justify-center text-white/60">
              Loading products...
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductList products={filteredProducts} refreshProducts={refreshProducts} />
          ) : (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 text-center">
              <p className="text-lg font-semibold text-white">No products found</p>
              <p className="mt-2 text-sm text-white/50">
                Try changing your search or add a new product.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}