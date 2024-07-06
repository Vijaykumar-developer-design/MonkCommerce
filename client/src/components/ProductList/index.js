import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ProductItem from "../ProductItem";
import VariantItem from "../VariantItem";
import update from "immutability-helper";
import "./index.css";

const ProductList = ({ products, setProducts }) => {
  const [showVariants, setShowVariants] = useState({});

  const moveProduct = (dragIndex, hoverIndex) => {
    const draggedProduct = products[dragIndex];
    setProducts(
      update(products, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedProduct],
        ],
      })
    );
  };

  const moveVariant = (
    dragIndex,
    hoverIndex,
    sourceProductId,
    targetProductId
  ) => {
    const sourceProductIndex = products.findIndex(
      (product) => product.id === sourceProductId
    );
    const targetProductIndex = products.findIndex(
      (product) => product.id === targetProductId
    );

    const draggedVariant = products[sourceProductIndex].variants[dragIndex];

    if (sourceProductId === targetProductId) {
      setProducts(
        update(products, {
          [sourceProductIndex]: {
            variants: {
              $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, draggedVariant],
              ],
            },
          },
        })
      );
    } else {
      setProducts(
        update(products, {
          [sourceProductIndex]: {
            variants: {
              $splice: [[dragIndex, 1]],
            },
          },
          [targetProductIndex]: {
            variants: {
              $splice: [[hoverIndex, 0, draggedVariant]],
            },
          },
        })
      );
    }
  };

  const toggleVariants = (productId) => {
    setShowVariants((prevShowVariants) => ({
      ...prevShowVariants,
      [productId]: !prevShowVariants[productId],
    }));
  };

  const removeProduct = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };
  const removeVariant = (productId, variantId) => {
    const productIndex = products.findIndex(
      (product) => product.id === productId
    );
    const updatedProducts = update(products, {
      [productIndex]: {
        variants: {
          $apply: (variants) =>
            variants.filter((variant) => variant.id !== variantId),
        },
      },
    });
    setProducts(updatedProducts);
  };
  return (
    <DndProvider backend={HTML5Backend}>
      {products.map((product, index) => (
        <div key={product.id} className="product-container">
          <ProductItem
            index={index}
            product={product}
            moveProduct={moveProduct}
            setProducts={setProducts}
            products={products}
            removeProduct={removeProduct}
          />
          <div className="discount-hide-parent">
            <button
              className="discount-hide"
              onClick={() => toggleVariants(product.id)}
            >
              {product.variants.length > 0
                ? showVariants[product.id]
                  ? "Hide Variants \u25B2"
                  : "Show Variants \u25BC"
                : ""}
            </button>
          </div>

          {showVariants[product.id] && (
            <div className="variant-list">
              {product.variants.map((variant, variantIndex) => (
                <VariantItem
                  key={variant.id}
                  index={variantIndex}
                  variant={variant}
                  moveVariant={moveVariant}
                  productId={product.id}
                  removeVariant={removeVariant}
                />
              ))}
            </div>
          )}
          <hr />
        </div>
      ))}
    </DndProvider>
  );
};

export default ProductList;
