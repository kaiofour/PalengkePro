import { IProduct } from "@/types/product";
import React from "react";
import Product from "./Product";

interface ProductListProps {
  products: IProduct[];
  refreshProducts: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, refreshProducts }) => {
  return (
    <div className="overflow-x-auto flex items-center" >
      <table className="table w-full">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Supplier</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <Product key={product.product_id} product={product} refreshProducts={refreshProducts} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
