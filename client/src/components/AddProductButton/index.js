import React from "react";
import "./index.css";
const AddProductButton = ({ addProduct }) => {
  return (
    <div className="add-procuct-parent">
      <button className="add-product-btn" onClick={addProduct}>
        Add Product
      </button>
    </div>
  );
};

export default AddProductButton;
