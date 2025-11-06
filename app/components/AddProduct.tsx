"use client";

import { AiOutlinePlus } from "react-icons/ai";
import Modal from "./Modal";
import { FormEventHandler, useState } from "react";
import { addProduct } from "../api/products/products";
import { useRouter } from "next/navigation";

const AddProduct = ({ refreshProducts }: { refreshProducts: () => void }) => {
  const router = useRouter();
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
              quantity: Number(quantity),      });

      setProductName("");
      setSupplier("");
      setPrice(0);
      setQuantity(0);
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
        className="btn btn-primary w-full"
      >
        Add new product <AiOutlinePlus className="ml-2" size={18} />
      </button>

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form onSubmit={handleSubmitNewProduct}>
          <h3 className="font-bold text-lg">Add new product</h3>
          <div className="modal-action flex flex-col gap-2">
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              type="text"
              placeholder="Product name"
              className="input input-bordered w-full"
            />
            <input
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              type="text"
              placeholder="Supplier"
              className="input input-bordered w-full"
            />
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="Price"
              className="input input-bordered w-full"
            />
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              placeholder="Quantity"
              className="input input-bordered w-full"
            />
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddProduct;
