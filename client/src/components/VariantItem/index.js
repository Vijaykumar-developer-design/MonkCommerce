import React from "react";
import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { RxDragHandleDots2 } from "react-icons/rx";
import "./index.css";
const VariantItem = ({
  variant,
  index,
  moveVariant,
  productId,
  removeVariant,
}) => {
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [discountType, setDiscountType] = useState("flat");
  const [discountVal, setDiscountVal] = useState("");
  const handleDiscountTypeChange = (e) => {
    setDiscountType(e.target.value);
  };
  const handleDiscountChange = (e) => {
    setDiscountVal(e.target.value);
  };
  const toggleDiscountForm = () => {
    setShowDiscountForm(!showDiscountForm);
  };
  const [{ isDragging }, drag] = useDrag({
    type: "VARIANT",
    item: { index, productId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "VARIANT",
    hover: (item) => {
      if (item.index !== index || item.productId !== productId) {
        moveVariant(item.index, index, item.productId, productId);
        item.index = index;
        item.productId = productId;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="variant-item"
    >
      <RxDragHandleDots2 />
      <div className="variantes">
        <span>{variant.title}</span>
        <span>{variant.stock}</span>
        <span>{variant.price}</span>
      </div>

      {showDiscountForm ? (
        <div className="discount-parent">
          <input
            className="discount-input-variant"
            type="number"
            value={discountVal}
            onChange={handleDiscountChange}
            placeholder="Discount"
          />
          <select
            className="selectelement"
            value={discountType}
            onChange={handleDiscountTypeChange}
          >
            <option value="flat">flat Off</option>
            <option value="percent">% Off</option>
          </select>
          <button
            className="remove-item"
            onClick={() => removeVariant(productId, variant.id)}
          >
            &times;
          </button>
        </div>
      ) : (
        <button className="add-discount" onClick={toggleDiscountForm}>
          Add Discount
        </button>
      )}
    </div>
  );
};

export default VariantItem;
