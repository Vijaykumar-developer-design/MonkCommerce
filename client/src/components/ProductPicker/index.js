import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./index.css"; // Assuming you have styling for ProductPicker
const serverUrl = "https://monk-commerce-server.vercel.app";

const ProductPicker = ({ isOpen, onClose, onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  // Fetch products based on search and pagination
  const fetchProducts = async () => {
    try {
      const url = `${serverUrl}/api/task/products/search?search=${search}&page=${page}&limit=10`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();
      // console.log("page=>", page);
      // console.log(data);
      const newProducts = data.map((item) => ({
        id: item.id,
        title: item.title,
        variants: item.variants.map((variant) => ({
          id: variant.id,
          title: variant.title,
          price: variant.price,
          stock: variant.inventory_quantity,
        })),
        imageSrc: item.image ? item.image.src : "",
      }));

      // Filter out duplicate products by ID
      const uniqueProducts = newProducts.filter(
        (product, index, self) =>
          index === self.findIndex((p) => p.id === product.id)
      );

      // Filter out duplicate variants within each product
      uniqueProducts.forEach((product) => {
        const uniqueVariants = product.variants.filter(
          (variant, index, self) =>
            index === self.findIndex((v) => v.id === variant.id)
        );
        product.variants = uniqueVariants;
      });

      setProducts((prevProducts) => {
        const allProducts = [...prevProducts, ...uniqueProducts];
        // Further filter out duplicates from combined previous and new products
        return allProducts.filter(
          (product, index, self) =>
            index === self.findIndex((p) => p.id === product.id)
        );
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen, page, search]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;

    if (scrollHeight - scrollTop <= clientHeight + 1) {
      // Add a small buffer to the condition
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleCheckboxChange = (product, variant = null) => {
    setSelectedProducts((prevSelectedProducts) => {
      const updatedSelection = { ...prevSelectedProducts };
      if (variant) {
        if (updatedSelection[product.id]?.includes(variant.id)) {
          updatedSelection[product.id] = updatedSelection[product.id].filter(
            (id) => id !== variant.id
          );
        } else {
          updatedSelection[product.id] = [
            ...(updatedSelection[product.id] || []),
            variant.id,
          ];
        }
        // Remove product id if no variants are selected
        if (updatedSelection[product.id].length === 0) {
          delete updatedSelection[product.id];
        }
      } else {
        if (updatedSelection[product.id]?.length) {
          delete updatedSelection[product.id];
        } else {
          updatedSelection[product.id] = product.variants.map(
            (variant) => variant.id
          );
        }
      }
      return updatedSelection;
    });
  };

  const isProductSelected = (product) =>
    !!selectedProducts[product.id] && selectedProducts[product.id].length > 0;

  const isVariantSelected = (product, variant) =>
    !!selectedProducts[product.id]?.includes(variant.id);

  const handleAddProducts = () => {
    const selectedProductList = Object.keys(selectedProducts).map(
      (productId) => {
        return products.find((p) => p.id === parseInt(productId));
      }
    );

    // console.log("Selected Products:", selectedProductList);

    selectedProductList.forEach((product) => {
      if (product) {
        onSelectProduct(product);
      }
    });
    onClose();
  };

  const handleParentCheckboxChange = (product) => {
    setSelectedProducts((prevSelectedProducts) => {
      const updatedSelection = { ...prevSelectedProducts };
      if (isProductSelected(product)) {
        delete updatedSelection[product.id];
      } else {
        updatedSelection[product.id] = product.variants.map(
          (variant) => variant.id
        );
      }
      return updatedSelection;
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Product Picker"
      className="product-picker-modal"
      overlayClassName="product-picker-overlay"
    >
      <span className="select-products-text">Select Products</span>
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <div className="search-bar">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
        />
      </div>
      <div className="product-list" onScroll={handleScroll}>
        {products.map((product) => (
          <div key={product.id} className="product-picker-item">
            <div className="parent-product">
              <div className="parent-checkbox-parent">
                <input
                  className="parent-checkbox"
                  type="checkbox"
                  checked={isProductSelected(product)}
                  onChange={() => handleParentCheckboxChange(product)}
                />
              </div>
              {product.imageSrc !== "" ? (
                <img src={product.imageSrc} alt="" />
              ) : (
                <span>{product.title}</span>
              )}
              <div>{product.title}</div>
            </div>
            <div className="child-variants">
              {product.variants.map((variant) => (
                <div key={`${product.id}-${variant.id}`} className="variant">
                  <div>
                    <input
                      className="child-checkbox"
                      type="checkbox"
                      checked={isVariantSelected(product, variant)}
                      onChange={() => handleCheckboxChange(product, variant)}
                    />
                  </div>
                  <span>{variant.title}</span>
                  <span>{variant.stock} available</span>
                  <span>${variant.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="product-picker-footer">
        <span>{Object.keys(selectedProducts).length} product(s) selected</span>
        <button onClick={onClose}>Close</button>
        <button onClick={handleAddProducts}>Add</button>
      </div>
    </Modal>
  );
};

export default ProductPicker;
