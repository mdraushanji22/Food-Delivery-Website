import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Categories from "./Category";
import Card from "../components/Card";
import { food_items } from "../food";
import { dataContext } from "../components/context/UserContext";
import { RxCross2 } from "react-icons/rx";
import Card2 from "../components/Card2";
import { useSelector } from "react-redux";
import teamImage from "../assets/team.png";
import { toast } from "react-toastify";

function Home() {
  const { cate, setCate, input, showCart, setShowCart } =
    useContext(dataContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Hero slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Menu section state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(food_items);

  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  // Get random food items for slider
  const getSliderItems = () => {
    // Shuffle array and take first 4 items
    const shuffled = [...food_items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4).map((item) => ({
      id: item.id,
      image: item.food_image,
      title: item.food_name,
      description: `Delicious ${item.food_name} from our menu`,
    }));
  };

  // Hero slider images from food.js
  const [slides, setSlides] = useState([]);

  // Initialize slider items
  useEffect(() => {
    setSlides(getSliderItems());
  }, []);

  // Auto slide effect - changed to 2000ms as requested
  useEffect(() => {
    if (!isHovered && slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 2000); // Changed from 1000ms to 2000ms

      return () => clearInterval(interval);
    }
  }, [isHovered, slides.length]);

  // Filter food items for menu section
  useEffect(() => {
    let result = food_items;

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.food_category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter((item) =>
        item.food_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(result);
  }, [selectedCategory, searchTerm]);

  // Scroll to section when navigation state changes
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  function filter(category) {
    if (category === "All") {
      setCate(food_items);
    } else {
      const newList = food_items.filter(
        (item) => item.food_category === category
      );
      setCate(newList);
    }
  }

  // Contact form handlers
  const handleContactChange = (e) => {
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

  const validateContactForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();

    if (validateContactForm()) {
      // Save form data to localStorage
      const contactFormData = {
        id: Date.now(), // Unique ID for each submission
        ...formData,
        submittedAt: new Date().toISOString(),
      };

      // Get existing contact forms from localStorage or initialize empty array
      const existingForms = JSON.parse(
        localStorage.getItem("contactForms") || "[]"
      );

      // Add new form data to the beginning of the array
      existingForms.unshift(contactFormData);

      // Save updated array back to localStorage
      localStorage.setItem("contactForms", JSON.stringify(existingForms));

      // In a real app, you would send the data to a server here
      console.log("Form submitted:", formData);
      toast.success("Thank you for your message! We'll get back to you soon.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    }
  };

  const items = useSelector((state) => state.cart);
  const subtotal = items.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );
  const deliveryFee = 20;
  const taxes = (subtotal * 0.5) / 100;
  const total = Math.floor(subtotal + deliveryFee + taxes);

  // Get unique categories for menu section
  const categories = [
    "All",
    ...new Set(food_items.map((item) => item.food_category)),
  ];

  return (
    <div className="bg-slate-200 w-full min-h-screen">
      {!showCart && <Nav />}

      {/* Hero Section with Image Slider */}
      <div
        className="relative w-full h-[400px] md:h-[600px] overflow-hidden mb-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {slides.length > 0 &&
          slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-opacity-40 flex flex-col items-center justify-center text-white p-4">
                <h2 className="text-2xl md:text-4xl font-bold mb-2 text-center">
                  {slide.title}
                </h2>
                <p className="text-base md:text-xl text-center">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}

        {/* Slider Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full cursor-pointer ${
                index === currentSlide ? "bg-white" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Menu Section */}
      <div id="menu" className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-green-600 mb-8">
            Our Menu
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all cursor-pointer text-sm md:text-base ${
                  selectedCategory === category
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-600 hover:bg-green-100"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex justify-center p-4">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer text-sm"
            />
          </div>

          {/* Menu Items */}
          <div className="w-full flex justify-center items-center gap-4 px-4 pt-6 pb-6 flex-wrap">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item.id}>
                  <Card
                    name={item.food_name}
                    image={item.food_image}
                    price={item.price}
                    type={item.food_type}
                    id={item.id}
                  />
                </div>
              ))
            ) : (
              <div className="text-xl text-center font-semibold py-8">
                No items found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-12 px-4 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-green-600 mb-8">
              About Our Food Delivery Service
            </h2>

            <div className="bg-white rounded-xl shadow-lg p-5 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-1/2">
                  <h3 className="text-xl font-bold text-green-600 mb-3">
                    Our Mission
                  </h3>
                  <p className="text-gray-700 text-base mb-3">
                    Welcome to our food delivery service! We are passionate
                    about bringing delicious meals right to your doorstep. Our
                    mission is to connect food lovers with the best local
                    restaurants, offering a convenient and delightful dining
                    experience from the comfort of your home.
                  </p>
                  <p className="text-gray-700 text-base">
                    Founded in 2025, we've been committed to quality, speed, and
                    exceptional customer service. Our team works tirelessly to
                    ensure that every order is prepared with care and delivered
                    fresh and on time.
                  </p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div>
                    <img
                      src={teamImage}
                      alt="Our Team"
                      className="rounded-xl w-full h-48 md:h-64 object-cover shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-5">
                <h3 className="text-xl font-bold text-green-600 mb-3">
                  Quality Promise
                </h3>
                <p className="text-gray-700 mb-3">
                  We partner with top-rated restaurants to ensure you receive
                  only the highest quality meals.
                </p>
                <p className="text-gray-700">
                  Our rigorous quality checks and partnerships with trusted
                  local restaurants guarantee that every meal meets our high
                  standards.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-5">
                <h3 className="text-xl font-bold text-green-600 mb-3">
                  Fast Delivery
                </h3>
                <p className="text-gray-700 mb-3">
                  Our efficient delivery system ensures your food arrives hot
                  and fresh, every time.
                </p>
                <p className="text-gray-700">
                  With our optimized delivery routes and real-time tracking, you
                  can enjoy your meal at its best temperature and quality.
                </p>
              </div>
            </div>

            <div className="bg-linear-to-r from-green-500 to-teal-600 rounded-xl shadow-lg p-6 text-white text-center">
              <h3 className="text-xl font-bold mb-3">Why Choose Us?</h3>
              <p className="text-base mb-5 max-w-2xl mx-auto">
                Whether you're craving a quick bite or planning a special meal,
                our diverse selection of cuisines ensures there's something for
                everyone. From local favorites to international delights, we've
                got you covered.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <div className="bg-white text-green-500 bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  Wide Variety
                </div>
                <div className="bg-white text-green-500 bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  Fast Delivery
                </div>
                <div className="bg-white text-green-500 bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  Easy Ordering
                </div>
                <div className="bg-white text-green-500 bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  24/7 Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-12 px-4">
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-green-600 mb-6">
            Contact Us
          </h2>

          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-5 mb-6">
            <form onSubmit={handleContactSubmit}>
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-semibold mb-2 text-sm"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleContactChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 cursor-pointer ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

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
                  onChange={handleContactChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 cursor-pointer ${
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
                  htmlFor="message"
                  className="block text-gray-700 font-semibold mb-2 text-sm"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleContactChange}
                  rows="4"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 cursor-pointer ${
                    errors.message
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                  placeholder="Your message..."
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors font-semibold cursor-pointer text-sm"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Footer-style "Get in Touch" section */}
          <div className="w-full bg-green-100 rounded-lg shadow-lg p-5 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* Contact Information */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-600 mb-3">
                  Get in Touch
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Email:</span>{" "}
                    mdraushanji22@gmail.com
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Phone:</span> +91 6280779503
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Address:</span> Sitapuri
                    part-1 C-Block Gali No.13 House RZC-8, New Delhi 110045
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-600 mb-3">
                  Quick Links
                </h3>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#top"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-gray-700 hover:text-green-600 font-semibold text-sm cursor-pointer"
                  >
                    Home
                  </a>
                  <a
                    href="#menu"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById("menu");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="text-gray-700 hover:text-green-600 font-semibold text-sm cursor-pointer"
                  >
                    Menu
                  </a>
                  <a
                    href="#about"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById("about");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="text-gray-700 hover:text-green-600 font-semibold text-sm cursor-pointer"
                  >
                    About
                  </a>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById("contact");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="text-gray-700 hover:text-green-600 font-semibold text-sm cursor-pointer"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-200 mt-6 pt-4 text-center">
              <p className="text-gray-600 text-sm">
                All Rights Reserved © 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <div
        className={`w-full md:w-[40vw] h-full fixed top-0 right-0 bg-white shadow-xl p-5 transition-all duration-500 flex flex-col items-center overflow-auto ${
          showCart ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="w-full flex justify-between items-center">
          <span className="text-green-400 font-semibold text-base">
            Order Items
          </span>
          <RxCross2
            onClick={() => setShowCart(false)}
            className="w-6 h-6 text-green-500 font-semibold cursor-pointer hover:bg-red-300"
          />
        </header>
        <div className="w-full mt-6 flex flex-col gap-6">
          {items.map((item, i) => {
            return (
              <Card2
                key={i}
                name={item.name}
                price={item.price}
                image={item.image}
                id={item.id}
                qty={item.qty}
              />
            );
          })}
        </div>
        {items.length > 0 ? (
          <>
            <div className="w-full border-t-2 border-b-2 border-gray-400 mt-5 flex flex-col gap-2 p-5 ">
              <div className="w-full flex justify-between items-center">
                <span className="text-base text-gray-600 font-semibold">
                  Subtotal
                </span>
                <span className="text-green-400 font-semibold text-base">
                  Rs {subtotal}/-
                </span>
              </div>
              <div className="w-full flex justify-between items-center">
                <span className="text-base text-gray-600 font-semibold">
                  Delivery Fee
                </span>
                <span className="text-green-400 font-semibold text-base">
                  Rs {deliveryFee}/-
                </span>
              </div>
              <div className="w-full flex justify-between items-center">
                <span className="text-base text-gray-600 font-semibold">
                  Taxes
                </span>
                <span className="text-green-400 font-semibold text-base">
                  Rs {taxes}/-
                </span>
              </div>
            </div>
            <div className="w-full flex justify-between items-center p-5">
              <span className="text-xl text-gray-600 font-semibold">Total</span>
              <span className="text-green-400 font-semibold text-xl">
                Rs {total}/-
              </span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-[80%] p-2 bg-green-500 rounded-lg hover:bg-green-400 text-white transition-all cursor-pointer text-lg font-semibold"
            >
              Checkout
            </button>
          </>
        ) : (
          <div className="text-center text-xl text-green-500 font-semibold pt-4 animate-bounce">
            Empty Cart
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
