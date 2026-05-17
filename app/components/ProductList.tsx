import { IProduct } from "@/types/product";
import React from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import Product from "./Product";
import type { SortField, SortDirection } from "@/app/dashboard/page";

interface ProductListProps {
  products: IProduct[];
  refreshProducts: () => void;
  sortField: SortField;
  sortDir: SortDirection;
  onSort: (field: SortField) => void;
}

const SortHeader: React.FC<{
  label: string;
  field: SortField;
  sortField: SortField;
  sortDir: SortDirection;
  onSort: (field: SortField) => void;
}> = ({ label, field, sortField, sortDir, onSort }) => {
  const active = sortField === field;
  return (
    <th
      className="cursor-pointer select-none px-4 py-4"
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1.5 text-left text-sm uppercase tracking-wide text-white/45 transition hover:text-white/70">
        {label}
        <span className="flex flex-col">
          <FiChevronUp
            size={10}
            className={active && sortDir === "asc" ? "text-indigo-400" : "text-white/20"}
          />
          <FiChevronDown
            size={10}
            className={active && sortDir === "desc" ? "text-indigo-400" : "text-white/20"}
          />
        </span>
      </span>
    </th>
  );
};

const ProductList: React.FC<ProductListProps> = ({
  products,
  refreshProducts,
  sortField,
  sortDir,
  onSort,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/10">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-white/10">
            <SortHeader label="Product Name" field="product_name" sortField={sortField} sortDir={sortDir} onSort={onSort} />
            <SortHeader label="Supplier" field="supplier" sortField={sortField} sortDir={sortDir} onSort={onSort} />
            <SortHeader label="Price" field="price" sortField={sortField} sortDir={sortDir} onSort={onSort} />
            <SortHeader label="Quantity" field="quantity" sortField={sortField} sortDir={sortDir} onSort={onSort} />
            <th className="px-4 py-4 text-left text-sm uppercase tracking-wide text-white/45">Actions</th>
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