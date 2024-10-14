import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Format date to include date and time
const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);

  // Format date as DD Month YYYY
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = date.toLocaleDateString("en-GB", options);

  // Format time to 12-hour format
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedTime = hours + ":" + strMinutes + " " + ampm;

  return (
    <span>
      {formattedDate}
      <br />
      {/* {formattedTime} */}
    </span>
  );
  
};

const OrderedItems = () => {
  const [orderedItems, setOrderedItems] = useState([]);
  const [mongoProducts, setMongoProducts] = useState([]);

  useEffect(() => {
    const fetchOrderedItems = async () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        try {
          const response = await fetch("http://localhost:4000/user/ordered", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setOrderedItems(data.ordered); // Adjusted to use the updated `ordered` field schema
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        } catch (error) {
          console.error("Error fetching ordered items:", error);
          toast.error("Failed to fetch ordered items", { autoClose: 2000 });
        }
      }
    };

    const fetchMongoProducts = async () => {
      try {
        const response = await fetch("http://localhost:4000/allproduct");
        if (response.ok) {
          const data = await response.json();
          setMongoProducts(data);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching products from MongoDB:", error);
        toast.error("Failed to fetch products", { autoClose: 2000 });
      }
    };

    fetchOrderedItems();
    fetchMongoProducts();
  }, []);

  const getProductById = (id) => {
    return mongoProducts.find((p) => p.id === Number(id));
  };

  return (
    <div className="container mx-auto p-6 pl-20 bg-red-50 rounded-lg shadow-md overflow-hidden">
      <ToastContainer />
      <h1 className="text-2xl font-semibold text-red-600 mb-10 flex justify-center bg-red-200">Your Orders</h1>
      <div className="grid grid-cols-7 gap-10 font-semibold text-gray-700 border-b pb-4 border-gray-300">
        <p className="text-left pl-4">Image</p>
        <p className="text-left">Title</p>
        <p className="text-left ml-4">Price per item</p>
        <p className="text-left">Quantity</p>
        <p className="text-left">Total price</p>
        <p className="text-left">Order Date</p>
        <p className="text-left">Status</p>
      </div>
      <hr className="my-4 border-red-300" />
      {orderedItems.map((item) => {
        const product = getProductById(item.productId);
        const totalPrice = product ? product.new_price * item.quantity : item.totalPrice;
        return (
          <div key={`${item.productId}-${item.orderedAt}`} className="grid grid-cols-7 gap-10 items-center py-4 border-b border-red-300">
            <img
              src={product ? product.image : item.imageUrl || "No Image"}
              alt={product ? product.name : item.name || "Product not found"}
              className="w-24 h-24 object-cover rounded-md"
            />
            <p className="text-red-700 font-medium">{product ? product.name : item.name || "Product not found"}</p>
            <p className="text-red-700 font-medium ml-4">
              ${product ? product.new_price : item.price}
            </p>
            <p className="text-red-700 font-medium pl-[22px]">{item.quantity}</p>
            <p className="text-red-700 font-medium">
              ${totalPrice}
            </p>
            <p className="text-red-700 font-medium">{item.orderedAt ? formatDateTime(item.orderedAt) : "N/A"}</p>
            <p className="text-red-600 font-bold">Arriving Soon</p>
          </div>
        );
      })}
    </div>
  );
};

export default OrderedItems;
