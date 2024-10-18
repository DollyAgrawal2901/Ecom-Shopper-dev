import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import for navigation
import { ShopContext } from "../Context/ShopContext";
import remove_icon from "./assets/cart_cross_icon.png"; // Adjust path if needed
import { loadStripe } from "@stripe/stripe-js";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const stripePromise = loadStripe(
  "pk_test_51Pt6lOP90NDEkZl4f9JCSK8RyEQq2BPnEH7D2bJ13X21cZSbK0MD0Qkx5Im57dw7uWMm24RJ0vLOzu38TENLCj8k00RSeuqRv4"
);

export default function CartItems() {
  const {
    all_product,
    cartItems,
    removeFromCart,
    getTotalCartAmount,
    updateCartItemQuantity,
  } = useContext(ShopContext);

  const [mongoProducts, setMongoProducts] = useState([]);
  const [address, setAddress] = useState(""); // State to store address
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchMongoProducts = async () => {
      try {
        const response = await fetch("http://localhost:4000/allproduct");
        if (response.ok) {
          const data = await response.json();
          setMongoProducts(data);
        } else {
          console.error(
            `Error fetching products from MongoDB: ${response.status}`
          );
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    // Fetch address from user profile
    const fetchAddress = async () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        try {
          const response = await fetch("http://localhost:4000/user/profile", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setAddress(data.address || "Address not available"); // Set address state
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      }
    };

    fetchMongoProducts();
    fetchAddress(); // Call the fetchAddress function
  }, []);

  const combinedProducts = [...all_product, ...mongoProducts];

  const getProductById = (id) => {
    return combinedProducts.find((p) => p.id === Number(id));
  };

  const calculateTotalAmount = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const product = getProductById(itemId);
      if (product && cartItems[itemId] > 0) {
        return total + product.new_price * cartItems[itemId];
      }
      return total;
    }, 0);
  };

  const makePayment = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      toast.error("Please login before proceeding", { autoClose: 2000 });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

   // Check if address is null, empty, or contains only whitespace
  if (!address || address.trim() === "" || address === "Address not available") {
    toast.error("Please add your delivery address", { autoClose: 2000 });
    return; // Stop further execution
  }

    const stripe = await stripePromise;
    const body = {
      items: Object.keys(cartItems)
        .map((itemId) => {
          const product = getProductById(itemId);
          if (product) {
            return {
              id: product.id,
              name: product.name,
              price: product.new_price,
              quantity: cartItems[itemId],
            };
          } else {
            console.error(`Product with id ${itemId} not found.`);
            return null; // Return null if product is not found
          }
        })
        .filter((item) => item && item.quantity > 0), // Filter out any null or invalid items
    };

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(
        "http://localhost:4000/create-checkout-session",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const session = await response.json();
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (error) {
        console.error("Error redirecting to Stripe Checkout:", error);
      }
    } catch (error) {
      console.error("Error creating payment session:", error);
    }
  };

  const handleIncrement = (id) => {
    const product = getProductById(id);
    if (product) {
      if (cartItems[id] < product.quantity) { // Check against backend quantity
        updateCartItemQuantity(id, cartItems[id] + 1);
      } 
      // else {
      //   toast.error("Cannot exceed available quantity", { autoClose: 2000 });
      // }
    }
  };

  return (
    <div className="my-[100px] mx-[170px]">
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] items-center gap-[75px] py-[20px] px-[0px] text-neutral-700 text-[18px] font-semibold">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr className="h-[3px] bg-slate-200 border-0" />
      {combinedProducts.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] items-center gap-[75px] py-[20px] px-[0px] text-neutral-700 text-[17px] font-medium">
                <img className="h-[62px]" src={e.image} alt={e.name} />
                <p>{e.name}</p>
                <p>₹{e.new_price}</p>
                <button
                  className="w-[64px] h-[50px] border border-[#ebebeb] bg-white"
                  onClick={() =>
                    handleIncrement(e.id)
                  }
                >
                  {cartItems[e.id]}
                </button>
                <p>₹{e.new_price * cartItems[e.id]}</p>
                <img
                  className="w-[15px] my-[0px] mx-[40px] cursor-pointer"
                  onClick={() => {
                    removeFromCart(e.id);
                  }}
                  src={remove_icon}
                  alt="Remove"
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="flex my-[100px] mx-[0px]">
        <div className="flex-1 flex flex-col mr-[200px] ">
          <h1>Cart Totals</h1>
          <div>
            <div className="flex justify-between py-[15px] px-[0px]">
              <p>SubTotal</p>
              <p>₹{calculateTotalAmount()}</p>
            </div>
            <hr />
            <div className="flex justify-between py-[15px] px-[0px]">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="flex justify-between py-[15px] px-[0px]">
              <h3>Total</h3>
              <h3>₹{calculateTotalAmount()}</h3>
            </div>
          </div>
          <button
            onClick={makePayment}
            className="w-[262px] h-[58px] outline-none border-none bg-red-600 text-slate-300 text-[16px] font-semibold cursor-pointer"
          >
            Proceed To Checkout
          </button>
        </div>
        <div className="mr-[180px]">
          <div className="flex-1 text-[16px] font-medium">
            <p className="text-[#555]">
              If you have a promo code, enter it here
            </p>
            <div className="flex w-[504px] mt-[15px] pl-[20px] h-[58px] bg-slate-100">
              <input
                className="border-none outline-none bg-transparent text-[16px] w-[330px] h-[50px]"
                type="text"
                placeholder="promo code"
              />
              <button className="w-[170px] h-[58px] text-[16px] bg-black text-white cursor-pointer">
                Submit
              </button>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex">
              <p className="mt-4 font-semibold text-lg">Delivery Address</p>
              <Link to="/profile">
                <button className="bg-gray-900 text-white px-4 rounded-3xl hover:bg-gray-800 transition-colors mt-[19px] ml-4">
                  Edit
                </button>
              </Link>
            </div>
          </div>
          <p className="text-gray-800 mt-4">{address}</p>{" "}
          {/* Display address */}
        </div>
      </div>
    </div>
  );
}
