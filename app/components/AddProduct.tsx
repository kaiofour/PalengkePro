"use client";

import { AiOutlinePlus } from "react-icons/ai";
import Modal from "./Modal";
import { FormEventHandler, useState } from "react";
import { addProduct } from "@/lib/services/crudService";

const AddProduct = ({ refreshProducts }: { refreshProducts: () => void }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [productName, setProductName] = useState<string>("");
  const [supplier, setSupplier] = useState<string>("");
  const [price, setPrice] = useState<number | string>("");
  const [quantity, setQuantity] = useState<number | string>("");

  const handleSubmitNewProduct: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await addProduct({
        product_name: productName,
        supplier,
        price: Number(price),
        quantity: Number(quantity),
      });

      setProductName("");
      setSupplier("");
      setPrice("");
      setQuantity("");
      setModalOpen(false);
      refreshProducts();
    } catch (err: any) {
      console.error("Add product failed:", err);
      alert("Failed to add product: " + err.message);
    }
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-4 font-semibold text-white transition hover:bg-indigo-600"
      >
        <AiOutlinePlus size={18} />
        Add Product
      </button>

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form onSubmit={handleSubmitNewProduct} className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white">Add New Product</h3>
            <p className="mt-1 text-sm text-white/50">
              Enter the product details below.
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
                placeholder="0"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-indigo-400"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/75">
                Quantity
              </label>
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                min="0"
                placeholder="0"
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
              Save Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddProduct;