import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { toast } from "react-toastify";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would register the user here
      console.log("Signup attempt:", formData);
      toast.success("Account created successfully!");
      // Redirect to login page after successful signup
      navigate("/login");
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-5">
          <h1 className="text-2xl font-bold text-center text-green-600 mb-5">
            Create Account
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2 text-sm">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 cursor-pointer text-sm ${
                  errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="Your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 cursor-pointer text-sm ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-semibold mb-2 text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 cursor-pointer text-sm ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            
            <div className="mb-5">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2 text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 cursor-pointer text-sm ${
                  errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors font-semibold mb-4 cursor-pointer text-sm"
            >
              Create Account
            </button>
            
            <div className="text-center">
              <p className="text-gray-700 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-green-500 hover:underline font-semibold">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;