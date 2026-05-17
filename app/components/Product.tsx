"use client";

import { IProduct } from "@/types/product";
import { FormEventHandler, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";
import { deleteProduct, editProduct } from "@/lib/services/crudService";

interface ProductProps {
  product: IProduct;
  refreshProducts: () => void;
}

const Product: React.FC<ProductProps> = ({ product, refreshProducts }) => {
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);

  const [productName, setProductName] = useState(product.product_name);
  const [supplier, setSupplier] = useState(product.supplier);
  const [price, setPrice] = useState<number | string>(product.price);
  const [quantity, setQuantity] = useState<number | string>(product.quantity);

  const handleSubmitEditProduct: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await editProduct({
        product_id: product.product_id,
        product_name: productName,
        supplier,
        price: Number(price),
        quantity: Number(quantity),
      });

      setOpenModalEdit(false);
      refreshProducts();
    } catch (err: any) {
      console.error("Edit product failed:", err);
      alert("Failed to edit product: " + err.message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setOpenModalDeleted(false);
      refreshProducts();
    } catch (err: any) {
      console.error("Delete product failed:", err);
      alert("Failed to delete product: " + err.message);
    }
  };

  return (
    <>
      <tr className="border-b border-white/5 transition hover:bg-white/[0.03]">
        <td className="px-4 py-4 font-medium text-white">{product.product_name}</td>
        <td className="px-4 py-4 text-white/70">{product.supplier}</td>
        <td className="px-4 py-4 text-white">₱{Number(product.price).toLocaleString()}</td>
        <td className="px-4 py-4 text-white">{product.quantity}</td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenModalEdit(true)}
              className="rounded-xl bg-blue-500/15 p-3 text-blue-400 transition hover:bg-blue-500/25"
            >
              <FiEdit size={18} />
            </button>

            <button
              onClick={() => setOpenModalDeleted(true)}
              className="rounded-xl bg-red-500/15 p-3 text-red-400 transition hover:bg-red-500/25"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </td>
      </tr>

      <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
        <form onSubmit={handleSubmitEditProduct} className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white">Edit Product</h3>
            <p className="mt-1 text-sm text-white/50">
              Update the selected product details.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/75">
              Product Name
            </label>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              type="text"
              placeholder="Product name"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-indigo-400"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/75">
              Supplier
            </label>
            <input
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              type="text"
              placeholder="Supplier"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-indigo-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/75">
                Price
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                min="0"
                placeholder="Price"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-indigo-400"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/75">
                Quantity
              </label>
              <input
                value={quantity ?? ""}
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                min="0"
                placeholder="Quantity"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-indigo-400"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-2xl bg-indigo-500 px-5 py-3 font-semibold text-white transition hover:bg-indigo-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      <Modal modalOpen={openModalDeleted} setModalOpen={setOpenModalDeleted}>
        <div className="space-y-5">
          <div>
            <h3 className="text-xl font-bold text-white">Delete Product</h3>
            <p className="mt-1 text-sm text-white/50">
              This action cannot be undone.
            </p>
          </div>

          <p className="text-sm text-white/75">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">{product.product_name}</span>?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setOpenModalDeleted(false)}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white/80 transition hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              onClick={() => handleDeleteProduct(product.product_id as string)}
              className="rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Product;