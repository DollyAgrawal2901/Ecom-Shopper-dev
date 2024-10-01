import React, { useEffect, useState } from "react";
import delete_icon from '../assets/cross_icon.png';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(null); // Track which product is being edited
  const [editedProduct, setEditedProduct] = useState({}); // Store edited product details

  const fetchInfo = async () => {
    try {
      const response = await fetch("http://localhost:4000/allproduct");
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const togglePopularStatus = async (productId, isPopular) => {
    try {
      const response = await fetch("http://localhost:4000/togglePopular", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: Number(productId), isPopular: !isPopular })
      });

      if (!response.ok) {
        throw new Error("Failed to update product status");
      }

      fetchInfo(); // Refetch products after updating
    } catch (error) {
      console.error("Error updating popular status:", error);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await fetch("http://localhost:4000/removeproduct", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      if (result.success) {
        console.log("Product removed successfully");
        await fetchInfo();
      } else {
        console.error("Failed to remove product");
      }
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const handleEditClick = (product) => {
    setIsEditing(product.id); // Set editing mode to this product
    setEditedProduct(product); // Initialize the edited product with current details
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch("http://localhost:4000/updateproduct", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editedProduct) // Send updated details to the backend
      });

      if (!response.ok) {
        throw new Error("Failed to update product details");
      }

      fetchInfo(); // Refetch products after saving
      setIsEditing(null); // Exit editing mode
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value
    }));
  };

  return (
    <div className="list-product w-full mx-auto p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-6 flex justify-center">All Products List</h1>
      <p className="text-lg font-semibold text-red-500 mb-4 flex justify-center">Total items available: {allProducts.length}</p>
      <div className="listproduct-format-main grid grid-cols-8 gap-4 py-2 bg-red-100 text-red-700 font-semibold">
        <p>Product Image</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p className="ml-[75px]">Popular</p>
        <p className=" xl:ml-[75px]">Actions</p>
        <p className=" xl:ml-[75px]">Remove</p>
      </div>
      <div className="listproduct-allproducts">
        {allProducts.length === 0 ? (
          <p className="text-center text-red-500 py-4">No products available</p>
        ) : (
          allProducts.map((product, index) => (
            <div key={index} className="listproduct-formatemain grid grid-cols-8 gap-4 py-4 border-b border-red-200 hover:bg-red-50">
              <div className="flex items-center justify-center">
                <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-md mr-16"/>
              </div>
              {isEditing === product.id ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editedProduct.name}
                    onChange={handleChange}
                    className="text-red-900 flex items-center"
                  />
                  <input
                    type="number"
                    name="old_price"
                    value={editedProduct.old_price}
                    onChange={handleChange}
                    className="text-red-600 flex items-center"
                  />
                  <input
                    type="number"
                    name="new_price"
                    value={editedProduct.new_price}
                    onChange={handleChange}
                    className="text-red-900 font-semibold flex items-center"
                  />
                  <select
                    name="category"
                    value={editedProduct.category}
                    onChange={handleChange}
                    className="text-gray-500 capitalize flex items-center"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                  </select>
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={editedProduct.popular}
                      onChange={() => togglePopularStatus(product.id, product.popular)}
                    />
                  </div>
                  <button
                    onClick={handleSaveClick}
                    className="flex items-center justify-center p-2 rounded-full"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p className="text-red-900 flex items-center">{product.name}</p>
                  <p className="text-red-600 flex items-center">₹{product.old_price}</p>
                  <p className="text-red-900 font-semibold flex items-center">₹{product.new_price}</p>
                  <p className="text-red-500 capitalize flex items-center">{product.category}</p>
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={product.popular}
                      onChange={() => togglePopularStatus(product.id, product.popular)}
                    />
                  </div>
                  <button
                    onClick={() => handleEditClick(product)}
                    className="flex items-center justify-center p-2 rounded-full"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="flex items-center justify-center p-2 rounded-full "
                  >
                    <img src={delete_icon} alt="Delete" className="w-6 h-6"/>
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListProduct;
