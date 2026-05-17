import { IProduct } from "@/types/product";
import React from "react";
import Product from "./Product";

interface ProductListProps {
  products: IProduct[];
  refreshProducts: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, refreshProducts }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/10">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-white/10 text-left text-sm uppercase tracking-wide text-white/45">
            <th className="px-4 py-4">Product Name</th>
            <th className="px-4 py-4">Supplier</th>
            <th className="px-4 py-4">Price</th>
            <th className="px-4 py-4">Quantity</th>
            <th className="px-4 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <Product
              key={product.product_id}
              product={product}
              refreshProducts={refreshProducts}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;