import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const [counter, setCounter] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch cart items from MongoDB
    const fetchCart = async () => {
      try {
        const response = await fetch("http://localhost:4000/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          // Now place the order with fetched cart items
          placeOrder(data.cart);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    // Function to place order
    const placeOrder = async (cart) => {
      try {
        const response = await fetch("http://localhost:4000/user/place-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ products: cart }), // Send cart items to backend
        });

        const data = await response.json();
        if (data.success) {
          // Now reset the cart after successful order placement
          resetCart();
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error placing order:", error);
      }
    };

    // Function to reset the cart
    const resetCart = async () => {
      try {
        const response = await fetch("http://localhost:4000/cart/reset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({}),
        });

        const data = await response.json();
        if (data.success) {
          console.log(data.message);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error resetting cart:", error);
      }
    };

    // First, fetch the cart and place the order
    fetchCart();

    // Timer to count down and navigate
    const timer = setTimeout(() => {
      navigate("/"); // Navigate to home after 10 seconds
      window.location.reload(); // Force reload to show updated cart
    }, 10000);

    // Countdown logic
    const countdown = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter === 1) {
          clearInterval(countdown); // Clear the interval to stop further execution
          return 0;
        }
        return prevCounter - 1;
      });
    }, 1000);

    // Cleanup
    return () => {
      clearTimeout(timer);
      clearInterval(countdown);
    };
  }, [navigate]);

  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
        <div className="bg-green-500 rounded-full p-4">
          <svg
            className="w-16 h-16 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mt-6">
          Your payment is successful
        </h1>
        <p className="mt-4 text-gray-700">
          Redirecting to Home in {counter}...
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 px-6 py-3 bg-red-700 text-white rounded-lg hover:opacity-90"
        >
          Home Page
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
