import React, { useState } from "react";
import Modal from "react-modal";
import ProductList from "./components/ProductList";
import AddProductButton from "./components/AddProductButton";
import "./App.css";
Modal.setAppElement("#root");

function App() {
  const [products, setProducts] = useState([]);

  const addProduct = () => {
    setProducts([...products, { id: Date.now(), title: "", variants: [] }]);
  };

  return (
    <div className="App">
      <h1>Add Products</h1>
      <div className="product-discount">
        <span>Product</span>
        <span>Discount</span>
      </div>
      <ProductList products={products} setProducts={setProducts} />
      <AddProductButton addProduct={addProduct} />
    </div>
  );
}

export default App;
