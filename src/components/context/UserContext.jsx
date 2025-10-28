import React, { createContext, useState, useEffect } from "react";
import { food_items } from "../../food";

export const dataContext = createContext();

function UserContext({ children }) {
  const [cate, setCate] = useState(food_items);
  const [input, setInput] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check for existing user session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("foodDeliveryUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("foodDeliveryUser", JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("foodDeliveryUser");
  };

  const data = {
    input,
    setInput,
    cate,
    setCate,
    showCart,
    setShowCart,
    currentUser,
    login,
    logout,
  };

  return (
    <div>
      <dataContext.Provider value={data}>{children}</dataContext.Provider>
    </div>
  );
}

export default UserContext;
