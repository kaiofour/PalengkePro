"use client";

import { IProduct } from "@/types/product";
import { FormEventHandler, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { deleteProduct, editProduct } from "../api/products/products";

interface ProductProps {
  product: IProduct;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const router = useRouter();
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);

  const [productName, setProductName] = useState(product.product_name);
  const [supplier, setSupplier] = useState(product.supplier);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);
  const [isleNumber, setIsleNumber] = useState(product.isle_number);

  const handleSubmitEditProduct: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await editProduct({
      id: product.id,
      product_name: productName,
      supplier,
      price,
      quantity,
      isle_number: isleNumber,
    });
    setOpenModalEdit(false);
    router.refresh();
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    setOpenModalDeleted(false);
    router.refresh();
  };

  return (
    <tr key={product.id}>
      <td>{product.product_name}</td>
      <td>{product.supplier}</td>
      <td>{product.price}</td>
      <td>{product.quantity}</td>
      <td>{product.isle_number}</td>
      <td className="flex gap-5">
        <FiEdit
          onClick={() => setOpenModalEdit(true)}
          cursor="pointer"
          className="text-blue-500"
          size={25}
        />
        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form onSubmit={handleSubmitEditProduct}>
            <h3 className="font-bold text-lg">Edit product</h3>
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
                onChange={(e) => setPrice(Number(e.target.value))}
                type="number"
                placeholder="Price"
                className="input input-bordered w-full"
              />
              <input
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                type="number"
                placeholder="Quantity"
                className="input input-bordered w-full"
              />
              <input
                value={isleNumber}
                onChange={(e) => setIsleNumber(e.target.value)}
                type="text"
                placeholder="Isle number"
                className="input input-bordered w-full"
              />
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </Modal>

        <FiTrash2
          onClick={() => setOpenModalDeleted(true)}
          cursor="pointer"
          className="text-red-500"
          size={25}
        />
        <Modal modalOpen={openModalDeleted} setModalOpen={setOpenModalDeleted}>
          <h3 className="text-lg">Are you sure you want to delete this product?</h3>
          <div className="modal-action">
            <button onClick={() => handleDeleteProduct(product.id)} className="btn">
              Yes
            </button>
          </div>
        </Modal>
      </td>
    </tr>
  );
};

export default Product;
