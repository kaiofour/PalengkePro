"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  FiLogOut,
  FiSearch,
  FiPackage,
  FiDollarSign,
  FiAlertTriangle,
  FiUsers,
} from "react-icons/fi";
import { getUser, signOut } from "@/lib/services/authService";
import { getProducts } from "@/lib/services/crudService";
import AddProduct from "../components/AddProduct";
import ProductList from "../components/ProductList";
import { IProduct } from "@/types/product";

type StockFilter = "all" | "in-stock" | "low-stock" | "out-of-stock";
export type SortField = "product_name" | "supplier" | "price" | "quantity";
export type SortDirection = "asc" | "desc";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sortField, setSortField] = useState<SortField>("product_name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  // Derived stats
  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price) * Number(p.quantity),
    0
  );
  const lowStockCount = products.filter(
    (p) => Number(p.quantity) > 0 && Number(p.quantity) <= 10
  ).length;
  const outOfStockCount = products.filter((p) => Number(p.quantity) === 0).length;
  const uniqueSuppliers = new Set(products.map((p) => p.supplier)).size;

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const term = search.toLowerCase().trim();
    if (term) {
      result = result.filter(
        (p) =>
          p.product_name.toLowerCase().includes(term) ||
          p.supplier.toLowerCase().includes(term)
      );
    }

    if (stockFilter === "in-stock")
      result = result.filter((p) => Number(p.quantity) > 10);
    else if (stockFilter === "low-stock")
      result = result.filter(
        (p) => Number(p.quantity) > 0 && Number(p.quantity) <= 10
      );
    else if (stockFilter === "out-of-stock")
      result = result.filter((p) => Number(p.quantity) === 0);

    result.sort((a, b) => {
      let aVal: string | number = a[sortField] as string | number;
      let bVal: string | number = b[sortField] as string | number;
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, search, stockFilter, sortField, sortDir]);

  const stockFilters: { label: string; value: StockFilter }[] = [
    { label: "All", value: "all" },
    { label: "In Stock", value: "in-stock" },
    { label: "Low Stock", value: "low-stock" },
    { label: "Out of Stock", value: "out-of-stock" },
  ];

  return (
    <div className="min-h-screen bg-[#070b17] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(0,0,0,0.25)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-medium tracking-[0.28em] text-indigo-300">
                PalengkePro
              </p>
              <h1 className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
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
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/15 px-4 py-3 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5" />
              ))}
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]">
                <div className="mb-3 w-fit rounded-xl bg-indigo-500/20 p-2 text-indigo-300">
                  <FiPackage size={18} />
                </div>
                <p className="text-2xl font-bold text-white">{products.length}</p>
                <p className="text-sm text-white/50">Total Products</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]">
                <div className="mb-3 w-fit rounded-xl bg-emerald-500/20 p-2 text-emerald-300">
                  <FiDollarSign size={18} />
                </div>
                <p className="text-2xl font-bold text-white">
                  ₱{totalValue.toLocaleString()}
                </p>
                <p className="text-sm text-white/50">Total Value</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]">
                <div className="mb-3 w-fit rounded-xl bg-amber-500/20 p-2 text-amber-300">
                  <FiAlertTriangle size={18} />
                </div>
                <p className="text-2xl font-bold text-white">
                  {lowStockCount + outOfStockCount}
                </p>
                <p className="text-sm text-white/50">Needs Restocking</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]">
                <div className="mb-3 w-fit rounded-xl bg-sky-500/20 p-2 text-sky-300">
                  <FiUsers size={18} />
                </div>
                <p className="text-2xl font-bold text-white">{uniqueSuppliers}</p>
                <p className="text-sm text-white/50">Suppliers</p>
              </div>
            </>
          )}
        </div>

        {/* Search + Add */}
        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 focus-within:border-indigo-500/50">
            <FiSearch className="shrink-0 text-white/45" size={18} />
            <input
              type="text"
              placeholder="Search product name or supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="shrink-0 text-xs text-white/40 transition hover:text-white/70"
              >
                Clear
              </button>
            )}
          </div>

          <AddProduct refreshProducts={refreshProducts} />
        </div>

        {/* Stock Filter Pills */}
        <div className="mb-5 flex flex-wrap gap-2">
          {stockFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStockFilter(f.value)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                stockFilter === f.value
                  ? "bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {f.label}
              {f.value === "low-stock" && lowStockCount > 0 && (
                <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-xs text-white">
                  {lowStockCount}
                </span>
              )}
              {f.value === "out-of-stock" && outOfStockCount > 0 && (
                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
                  {outOfStockCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Product count bar */}
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
          {(sortField !== "product_name" || sortDir !== "asc") && (
            <button
              onClick={() => { setSortField("product_name"); setSortDir("asc"); }}
              className="text-xs text-indigo-400 transition hover:text-indigo-300"
            >
              Reset sort
            </button>
          )}
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_40px_rgba(0,0,0,0.2)]">
          {loading ? (
            <div className="space-y-3 p-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductList
              products={filteredProducts}
              refreshProducts={refreshProducts}
              sortField={sortField}
              sortDir={sortDir}
              onSort={handleSort}
            />
          ) : (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 text-center">
              <div className="mb-4 rounded-2xl bg-white/5 p-4 text-white/25">
                <FiPackage size={32} />
              </div>
              <p className="text-lg font-semibold text-white">No products found</p>
              <p className="mt-2 text-sm text-white/50">
                {search || stockFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "Add your first product to get started."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}