import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { dataContext } from "../components/context/UserContext";
import Card2 from "../components/Card2";

function Cart() {
  const { currentUser } = useContext(dataContext);
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart);
  
  // If user is not logged in, redirect to login page
  if (!currentUser) {
    navigate("/login");
    return null;
  }
  
  const subtotal = items.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );
  const deliveryFee = 20;
  const taxes = (subtotal * 0.5) / 100;
  const total = Math.floor(subtotal + deliveryFee + taxes);

  return (
    <div className="bg-slate-200 w-full min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-600 mb-8">Your Cart</h1>
        
        {items.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Order Items ({items.length})</h2>
                </div>
                
                <div className="space-y-6">
                  {items.map((item) => (
                    <Card2
                      key={item.id}
                      name={item.name}
                      price={item.price}
                      image={item.image}
                      id={item.id}
                      qty={item.qty}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">Rs {subtotal}/-</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">Rs {deliveryFee}/-</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-semibold">Rs {taxes}/-</span>
                  </div>
                  
                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-500">Rs {total}/-</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold mt-6 cursor-pointer"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;