import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { MdEdit } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";
import ProductPicker from "../ProductPicker";
import "./index.css";

const ProductItem = ({
  product,
  index,
  moveProduct,
  setProducts,
  products,
  removeProduct,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [discountType, setDiscountType] = useState("flat");
  const [discountVal, setDiscountVal] = useState("");
  const handleDiscountChange = (e) => {
    setDiscountVal(e.target.value);
  };
  // Define drag and drop functionality
  const [, drag] = useDrag({
    type: "product",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "product",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveProduct(draggedItem.index, index); // Call the moveProduct function to update order
        draggedItem.index = index;
      }
    },
  });

  // Update product when selected from picker
  const handleProductChange = (newProduct) => {
    const updatedProducts = [...products]; // Create a copy of products array
    updatedProducts[index] = newProduct; // Update the specific product
    setProducts(updatedProducts); // Update state with new array
  };

  // Handle showing the discount form
  const toggleDiscountForm = () => {
    setShowDiscountForm(!showDiscountForm);
  };

  // Handle selecting discount type
  const handleDiscountTypeChange = (e) => {
    setDiscountType(e.target.value);
  };

  return (
    <div ref={(node) => drag(drop(node))} className="product-item">
      <div className="drag-handle">
        <RxDragHandleDots2 />
        <span>{index + 1}.</span>
      </div>
      <div className="product-details">
        <div className="input-container">
          <input
            type="text"
            placeholder="Select Product"
            value={product.title}
            readOnly
          />
          <MdEdit className="edit-icon" onClick={() => setIsPickerOpen(true)} />
        </div>
      </div>
      {showDiscountForm ? (
        <div className="discount-parent">
          <input
            className="discount-input"
            type="number"
            value={discountVal}
            onChange={handleDiscountChange}
            placeholder="Discount"
          />
          <select value={discountType} onChange={handleDiscountTypeChange}>
            <option value="flat">flat Off</option>
            <option value="percent">% Off</option>
          </select>
          <button
            className="remove-item"
            onClick={() => removeProduct(product.id)}
          >
            &times;
          </button>
        </div>
      ) : (
        <button className="add-discount" onClick={toggleDiscountForm}>
          Add Discount
        </button>
      )}
      <ProductPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectProduct={handleProductChange}
      />
    </div>
  );
};

export default ProductItem;
