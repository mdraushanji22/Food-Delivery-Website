import React, { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { dataContext } from "../components/context/UserContext";
import { toast } from "react-toastify";
import { RemoveItem } from "../redux/cartSlice";

function Checkout() {
  const { currentUser } = useContext(dataContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart);
  
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: ""
  });
  
  const [errors, setErrors] = useState({});
  const [shouldNavigate, setShouldNavigate] = useState(false);

  // Handle navigation after successful order placement
  useEffect(() => {
    if (shouldNavigate) {
      navigate("/my-orders");
    }
  }, [shouldNavigate, navigate]);

  const subtotal = items.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );
  const deliveryFee = 20;
  const taxes = (subtotal * 0.5) / 100;
  const total = Math.floor(subtotal + deliveryFee + taxes);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Create order object
      const order = {
        id: Date.now(),
        userId: currentUser.email,
        items: [...items],
        deliveryAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone
        },
        subtotal,
        deliveryFee,
        taxes,
        total,
        orderDate: new Date().toISOString(),
        status: "Processing"
      };
      
      // Save order to localStorage
      try {
        const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        existingOrders.push(order);
        localStorage.setItem("orders", JSON.stringify(existingOrders));
        
        // Clear cart
        items.forEach(item => {
          dispatch(RemoveItem(item.id));
        });
        
        toast.success("Order placed successfully!");
        // Set state to trigger navigation in useEffect
        setShouldNavigate(true);
      } catch (error) {
        toast.error("Failed to place order. Please try again.");
      }
    }
  };

  return (
    <div className="bg-slate-200 w-full min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-green-600 mb-6">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Order Summary */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-5 mb-6">
              <h2 className="text-xl font-semibold mb-5">Order Summary</h2>
              
              <div className="space-y-4 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 overflow-hidden rounded-lg mr-3">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <p className="text-gray-600 text-xs">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <div className="font-semibold text-sm">Rs {item.price * item.qty}/-</div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Subtotal</span>
                  <span className="font-semibold text-sm">Rs {subtotal}/-</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Delivery Fee</span>
                  <span className="font-semibold text-sm">Rs {deliveryFee}/-</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Taxes</span>
                  <span className="font-semibold text-sm">Rs {taxes}/-</span>
                </div>
                
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-green-500">Rs {total}/-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Checkout Form */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-5">
              <h2 className="text-xl font-semibold mb-5">Delivery Information</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="fullName" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.fullName 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-300 focus:ring-green-500"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="address" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.address 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-300 focus:ring-green-500"
                    }`}
                    placeholder="Street address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label htmlFor="city" className="block text-gray-700 font-semibold mb-2 text-sm">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.city 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="postalCode" className="block text-gray-700 font-semibold mb-2 text-sm">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.postalCode 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                      placeholder="Postal code"
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-5">
                  <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.phone 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-300 focus:ring-green-500"
                    }`}
                    placeholder="10-digit phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg mb-5">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-sm">₹</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-700 text-sm">Cash on Delivery</h3>
                      <p className="text-green-600 text-xs">Pay with cash upon delivery</p>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold cursor-pointer text-sm"
                >
                  Place Order (Rs {total}/-)
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;