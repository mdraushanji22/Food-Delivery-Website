import { MdFastfood, MdMenu, MdClose } from "react-icons/md";
import { LuShoppingBag } from "react-icons/lu";
import { useContext, useEffect, useState } from "react";
import { dataContext } from "./context/UserContext";
import { food_items } from "../food";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function Nav() {
  const { cate, setCate, showCart, setShowCart, currentUser, logout } =
    useContext(dataContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const items = useSelector((state) => state.cart);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
    // Close mobile menu after selection
    setMobileMenuOpen(false);
  };

  // Scroll to top for Home link
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveSection("");
    // Close mobile menu after selection
    setMobileMenuOpen(false);
  };

  // Handle cart click - redirect to login if not logged in
  const handleCartClick = () => {
    if (currentUser) {
      setShowCart(true);
    } else {
      navigate("/login");
    }
    // Close mobile menu
    setMobileMenuOpen(false);
  };

  // Check which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["menu", "about", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full bg-white h-[100px] flex justify-between items-center px-5 md:px-8 sticky top-0 z-10">
      <div className="w-[60px] h-[60px] bg-white flex justify-center items-center rounded-md shadow-2xl">
        <MdFastfood className="w-[30px] h-[30px] text-green-500" />
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex gap-8">
        <button
          onClick={scrollToTop}
          className={`font-semibold text-[20px] ${
            activeSection === ""
              ? "text-green-500"
              : "text-gray-600 hover:text-green-500"
          } cursor-pointer`}
        >
          Home
        </button>
        <button
          onClick={() => scrollToSection("menu")}
          className={`font-semibold text-[20px] ${
            activeSection === "menu"
              ? "text-green-500"
              : "text-gray-600 hover:text-green-500"
          } cursor-pointer`}
        >
          Menu
        </button>
        <button
          onClick={() => scrollToSection("about")}
          className={`font-semibold text-[20px] ${
            activeSection === "about"
              ? "text-green-500"
              : "text-gray-600 hover:text-green-500"
          } cursor-pointer`}
        >
          About
        </button>
        <button
          onClick={() => scrollToSection("contact")}
          className={`font-semibold text-[20px] ${
            activeSection === "contact"
              ? "text-green-500"
              : "text-gray-600 hover:text-green-500"
          } cursor-pointer`}
        >
          Contact
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Desktop User Authentication State */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <>
              <span className="text-gray-700 font-semibold">
                Hi, {currentUser.name} 👋
              </span>
              <Link
                to="/my-orders"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer"
              >
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            /* Login/Signup Buttons */
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-white text-green-500 border border-green-500 rounded-md hover:bg-green-50 transition-colors cursor-pointer"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        <div
          onClick={handleCartClick}
          className="w-[60px] h-[60px] bg-white flex justify-center items-center rounded-md shadow-2xl relative cursor-pointer"
        >
          <span className="absolute top-0 right-2 text-green-500 font-semibold text-[18px]">
            {items.length}
          </span>
          <LuShoppingBag className="w-[30px] h-[30px] text-green-500" />
        </div>

        {/* Mobile Menu Button - moved to the right of cart icon */}
        <button
          className="md:hidden text-gray-600 hover:text-green-500 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <MdClose className="w-8 h-8" />
          ) : (
            <MdMenu className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-20 flex flex-col">
          <div className="flex justify-between items-center p-5 border-b">
            <div className="w-[50px] h-[50px] bg-white flex justify-center items-center rounded-md shadow-xl">
              <MdFastfood className="w-[25px] h-[25px] text-green-500" />
            </div>
            <button
              className="text-gray-600 hover:text-green-500 focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MdClose className="w-8 h-8" />
            </button>
          </div>

          <div className="flex-1 flex flex-col py-4 px-4 overflow-y-auto">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-2 mb-6 items-center justify-center">
              <button
                onClick={scrollToTop}
                className={`font-semibold text-lg py-3 ${
                  activeSection === "" ? "text-green-500" : "text-gray-600"
                } cursor-pointer`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("menu")}
                className={`font-semibold text-lg py-3 ${
                  activeSection === "menu" ? "text-green-500" : "text-gray-600"
                } cursor-pointer`}
              >
                Menu
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className={`font-semibold text-lg py-3 ${
                  activeSection === "about" ? "text-green-500" : "text-gray-600"
                } cursor-pointer`}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className={`font-semibold text-lg py-3 ${
                  activeSection === "contact"
                    ? "text-green-500"
                    : "text-gray-600"
                } cursor-pointer`}
              >
                Contact
              </button>
            </div>

            {/* Mobile User Authentication State */}
            <div className="flex flex-col gap-3 mt-auto">
              {currentUser ? (
                <>
                  <div className="py-2">
                    <span className="text-gray-700 font-semibold">
                      Hi, {currentUser.name} 👋
                    </span>
                  </div>
                  <Link
                    to="/my-orders"
                    className="px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer text-center font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                /* Login/Signup Buttons */
                <>
                  <Link
                    to="/login"
                    className="px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer text-center font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-3 bg-white text-green-500 border border-green-500 rounded-md hover:bg-green-50 transition-colors cursor-pointer text-center font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nav;
