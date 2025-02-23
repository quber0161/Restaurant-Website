/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || ""); // 🔹 Store user role
  const [food_list, setFoodList] = useState([]);
  const [category_list, setCategoryList] = useState([]);

  // Updated addToCart to store items as objects with quantity, extras, and comment
  const addToCart = async (itemId, extras = [], comment = "") => {
    if (!cartItems[itemId]) {
        setCartItems((prev) => ({
            ...prev, 
            [itemId]: { quantity: 1, extras, comment }
        }));
    } else {
        setCartItems((prev) => ({
            ...prev, 
            [itemId]: {
                quantity: prev[itemId].quantity + 1,
                extras,
                comment
            }
        }));
    }
  
    // If token exists, send the data to the backend
    if (token) {
      try {
        await axios.post(url + "/api/cart/add", { itemId, extras, comment }, { headers: { token } });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };
  
  
  

  // Updated removeFromCart to work with the new structure
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const current = prev[itemId];
      if (!current) return prev;
      if (current.quantity > 1) {
        return {
          ...prev,
          [itemId]: {
            ...current,
            quantity: current.quantity - 1,
          },
        };
      } else {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      }
    });
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  // Calculate total cart amount, including extras (assuming $2 per extra)
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const cartItem = cartItems[itemId];
      let foodItem = food_list.find((product) => product._id === itemId);
      if (foodItem) {
        const extrasCost = (cartItem.extras?.length || 0) * 2; // Each extra costs $2
        totalAmount += (foodItem.price + extrasCost) * cartItem.quantity;
      }
    }
    return totalAmount;
  };

  const loadCartData = async (token) => {
    const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
    setCartItems(response.data.cartData);
  };

  const fetchCategories = async () => {
    const response = await axios.get(url + "/api/category/list");
    setCategoryList(response.data.categories);
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    setUserRole("");
    Navigate("/"); // Redirect to login after logout
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      await fetchCategories();
      if (token) {
        await loadCartData(token);
      }
    }
    loadData();
  }, [token]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    category_list,
    userRole,
    setUserRole,
    logout,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
