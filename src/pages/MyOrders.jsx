import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dataContext } from "../components/context/UserContext";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function MyOrders() {
  const { currentUser } = useContext(dataContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data has been loaded
    const checkAuth = () => {
      // If currentUser is null but we have user data in localStorage, wait a bit more
      const storedUser = localStorage.getItem("foodDeliveryUser");

      if (!currentUser && !storedUser) {
        // Definitely not logged in
        navigate("/login");
        setLoading(false);
        return;
      }

      if (currentUser) {
        // User is authenticated, load orders
        loadOrders();
      }

      // If we have stored user data but currentUser is still null,
      // it means we're still loading - wait a bit more
      setLoading(false);
    };

    // Small delay to allow context to initialize
    const timer = setTimeout(checkAuth, 100);

    return () => clearTimeout(timer);
  }, [currentUser, navigate]);

  // Load orders from localStorage
  const loadOrders = () => {
    try {
      const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      // Filter orders for current user
      const userOrders = allOrders.filter(
        (order) => order.userId === currentUser.email
      );
      setOrders(userOrders);
    } catch (error) {
      setOrders([]);
    }

    // Also listen for storage changes in case orders are updated in another tab
    const handleStorageChange = (e) => {
      if (e.key === "orders") {
        try {
          const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
          // Filter orders for current user
          const userOrders = allOrders.filter(
            (order) => order.userId === currentUser.email
          );
          setOrders(userOrders);
        } catch (error) {
          setOrders([]);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  };

  const handleRemoveOrder = (orderId) => {
    try {
      const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const updatedOrders = allOrders.filter((order) => order.id !== orderId);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));

      // Update state
      const userOrders = updatedOrders.filter(
        (order) => order.userId === currentUser.email
      );
      setOrders(userOrders);

      toast.success("Order removed successfully!");
    } catch (error) {
      toast.error("Failed to remove order. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to generate and download PDF invoice
  const downloadInvoice = (order) => {
    try {
      // Create new jsPDF instance
      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: `Invoice #${order.id}`,
        subject: "Food Delivery Invoice",
        author: "Food Delivery Service",
      });

      // Add company header
      doc.setFontSize(24);
      doc.setTextColor(34, 197, 94); // Green color
      doc.setFont(undefined, "bold");
      doc.text("FOOD DELIVERY", 20, 25);

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Add company tagline
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text("Delicious meals delivered to your doorstep", 20, 35);

      // Add horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 40, 190, 40);

      // Add invoice title
      doc.setFontSize(18);
      doc.setFont(undefined, "bold");
      doc.text("INVOICE", 150, 30);

      // Add invoice details box
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");

      // Customer details
      doc.text("BILL TO:", 20, 55);
      doc.setFont(undefined, "bold");
      doc.text(order.deliveryAddress.fullName, 20, 62);
      doc.setFont(undefined, "normal");
      doc.text(order.deliveryAddress.address, 20, 69);
      doc.text(
        `${order.deliveryAddress.city}, ${order.deliveryAddress.postalCode}`,
        20,
        76
      );
      doc.text(order.deliveryAddress.phone, 20, 83);

      // Invoice details
      doc.text("INVOICE #", 150, 55);
      doc.text("DATE", 150, 65);
      doc.text("STATUS", 150, 75);

      doc.setFont(undefined, "bold");
      doc.text(`#${order.id}`, 175, 55);
      doc.text(formatDate(order.orderDate), 175, 65);
      doc.text(order.status, 175, 75);

      // Add order items table
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("Order Items", 20, 100);

      // Prepare table data
      const tableData = order.items.map((item) => [
        item.name,
        item.qty,
        `Rs ${item.price}/-`,
        `Rs ${item.price * item.qty}/-`,
      ]);

      // Add table using the correct jspdf-autotable syntax
      autoTable(doc, {
        startY: 110,
        head: [["Item", "Quantity", "Price", "Total"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [34, 197, 94], // Green color matching the theme
          fontSize: 11,
        },
        bodyStyles: {
          fontSize: 10,
        },
        styles: {
          cellPadding: 5,
        },
        margin: { horizontal: 20 },
      });

      // Add order summary
      const finalY = doc.lastAutoTable.finalY + 15;

      // Summary labels
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text("Subtotal:", 140, finalY);
      doc.text("Delivery Fee:", 140, finalY + 10);
      doc.text("Taxes:", 140, finalY + 20);

      // Summary values
      doc.text(`Rs ${order.subtotal}/-`, 180, finalY, null, null, "right");
      doc.text(
        `Rs ${order.deliveryFee}/-`,
        180,
        finalY + 10,
        null,
        null,
        "right"
      );
      doc.text(`Rs ${order.taxes}/-`, 180, finalY + 20, null, null, "right");

      // Grand total with highlight
      doc.setFillColor(34, 197, 94, 0.1); // Light green background
      doc.roundedRect(130, finalY + 25, 70, 15, 2, 2, "F"); // Filled rectangle - increased width
      doc.setFont(undefined, "bold");
      doc.setTextColor(34, 197, 94); // Green color
      doc.text("GRAND TOTAL:", 135, finalY + 35); // Adjusted position
      doc.text(`Rs ${order.total}/-`, 190, finalY + 35, null, null, "right"); // Adjusted position

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Add footer
      const footerY = doc.internal.pageSize.height - 20;
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text("Thank you for your order!", 105, footerY, null, null, "center");
      doc.text(
        "For support, contact: support@fooddelivery.com",
        105,
        footerY + 7,
        null,
        null,
        "center"
      );

      // Add page number
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          `Page ${i} of ${pageCount}`,
          190,
          footerY + 14,
          null,
          null,
          "right"
        );
      }

      // Save the PDF
      doc.save(`invoice-${order.id}.pdf`);

      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice. Please try again.");
    }
  };

  // Show loading state or redirect if not authenticated
  if (loading) {
    return (
      <div className="bg-slate-200 w-full min-h-screen flex items-center justify-center">
        <div className="text-2xl text-green-600 font-semibold">Loading...</div>
      </div>
    );
  }

  // Don't render anything while checking authentication
  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg-slate-200 w-full min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-green-600">My Orders</h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-semibold cursor-pointer whitespace-nowrap text-sm"
          >
            Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              No Orders Found
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-4 border-b">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">
                        Order #{order.id}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold text-green-600">
                        Rs {order.total}/-
                      </p>
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 mt-1">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-b">
                  <h3 className="text-base font-semibold mb-3">
                    Delivery Address
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-sm">
                      <span className="font-semibold">Name:</span>{" "}
                      {order.deliveryAddress.fullName}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Address:</span>{" "}
                      {order.deliveryAddress.address}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">City:</span>{" "}
                      {order.deliveryAddress.city}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Postal Code:</span>{" "}
                      {order.deliveryAddress.postalCode}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Phone:</span>{" "}
                      {order.deliveryAddress.phone}
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-base font-semibold mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row justify-between items-start gap-3"
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 overflow-hidden rounded-lg mr-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-gray-600 text-xs">
                              Qty: {item.qty}
                            </p>
                          </div>
                        </div>
                        <div className="font-semibold text-sm self-center">
                          Rs {item.price * item.qty}/-
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 text-sm">Subtotal</span>
                      <span className="font-semibold text-sm">
                        Rs {order.subtotal}/-
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 text-sm">
                        Delivery Fee
                      </span>
                      <span className="font-semibold text-sm">
                        Rs {order.deliveryFee}/-
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 text-sm">Taxes</span>
                      <span className="font-semibold text-sm">
                        Rs {order.taxes}/-
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold mt-2">
                      <span>Total</span>
                      <span className="text-green-500">Rs {order.total}/-</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-end gap-2">
                  <button
                    onClick={() => downloadInvoice(order)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-semibold cursor-pointer text-sm"
                  >
                    Download Invoice
                  </button>
                  <button
                    onClick={() => handleRemoveOrder(order.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-semibold cursor-pointer text-sm"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
