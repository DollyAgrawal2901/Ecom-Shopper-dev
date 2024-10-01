import React, { createContext, useState, useEffect } from "react";
import allProductData from "../Components/Assets/all_product.js";

export const ShopContext = createContext(null);

const getDefaultCart = (allProductData) => {
  let cart = {};
  for (let index = 0; index < allProductData.length; index++) {
    cart[allProductData[index].id] = 0; // Initialize cart items with 0 quantity
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAllProduct] = useState(allProductData);
  const [cartItems, setCartItems] = useState(() =>
    JSON.parse(localStorage.getItem('cart')) || getDefaultCart(allProductData)
  );
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    if (authToken) {
      const fetchCartFromBackend = async () => {
        try {
          const response = await fetch("http://localhost:4000/cart", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setCartItems(data.cart); // Initialize cartItems with backend data
            // Sync local cart with backend if needed
            syncLocalCartWithBackend();
          } else {
            console.error("Failed to fetch cart data");
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      };

      fetchCartFromBackend();
    }
  }, [authToken]);

  const syncLocalCartWithBackend = async () => {
    const localCart = JSON.parse(localStorage.getItem('cart')) || {};
    
    if (Object.keys(localCart).length === 0) return; // No local cart to sync

    try {
      await Promise.all(Object.keys(localCart).map(async (itemId) => {
        const quantity = localCart[itemId];
        if (quantity > 0) {
          await fetch("http://localhost:4000/cart/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ productId: itemId.toString(), quantity }),
          });
        }
      }));

      // Clear local storage after syncing
      localStorage.removeItem('cart');
      setCartItems(getDefaultCart(all_product)); // Reset cartItems to default
    } catch (error) {
      console.error("Error syncing local cart with backend:", error);
    }
  };

  const addToCart = async (itemId, quantity) => {
    console.log("Sending productId and quantity:", { productId: itemId, quantity });

    if (!authToken) {
      // Update local cart and localStorage if user is not logged in
      const updatedCart = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + quantity };
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ productId: itemId.toString(), quantity }),
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart);
      } else {
        console.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const removeFromCart = async (itemId, quantity = 1) => {
    if (!authToken) {
      // Update local cart and localStorage if user is not logged in
      const updatedCart = { ...cartItems };
      if (updatedCart[itemId] > 0) {
        updatedCart[itemId] = Math.max(0, updatedCart[itemId] - quantity);
        if (updatedCart[itemId] === 0) delete updatedCart[itemId];
      }
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ productId: itemId.toString(), quantity }),
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart); // Update cart with the backend response
      } else {
        console.error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const updateCartItemQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(itemId, -quantity); // If quantity is zero or less, use remove
    } else {
      await addToCart(itemId, quantity - (cartItems[itemId] || 0)); // Update with the new quantity
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    updateCartItemQuantity,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
