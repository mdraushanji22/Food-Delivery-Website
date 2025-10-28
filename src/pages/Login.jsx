import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { toast } from "react-toastify";
import { dataContext } from "../components/context/UserContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useContext(dataContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // In a real app, you would authenticate the user here
      console.log("Login attempt:", formData);

      // For demo purposes, we'll just simulate a successful login
      const userData = {
        name: formData.email.split("@")[0],
        email: formData.email,
      };

      login(userData);
      toast.success("Login successful!");
      // Redirect to home page after successful login
      navigate("/");
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-5">
          <h1 className="text-2xl font-bold text-center text-green-600 mb-5">
            Login
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2 text-sm"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 cursor-pointer text-sm ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold mb-2 text-sm"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 cursor-pointer text-sm ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors font-semibold mb-4 cursor-pointer text-sm"
            >
              Login
            </button>

            <div className="text-center">
              <p className="text-gray-700 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-green-500 hover:underline font-semibold"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
