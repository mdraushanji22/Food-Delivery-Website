import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";

// Load cart state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("cartState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save cart state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("cartState", serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

// Load initial state
const preloadedState = {
  cart: loadState() || []
};

export const store = configureStore({
  reducer: {
    cart: cartSlice,
  },
  preloadedState
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveState(store.getState().cart);
});