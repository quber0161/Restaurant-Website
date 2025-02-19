/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

// eslint-disable-next-line react/prop-types
const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 1; // 🔹 Change this to set items per page

  // 🟢 Fetch orders from backend
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        const paidOrders = response.data.data.filter(order => order.payment === true);
        setOrders(paidOrders);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    const interval = setInterval(()=>{
      fetchAllOrders();
    }, 10000)

    return() => clearInterval(interval);
  }, []);

  // 🟢 Change order status
  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      await fetchAllOrders();
    }
  };

  // 🟢 Group orders by date
  const groupOrdersByDate = () => {
    const groupedOrders = {};

    orders.forEach((order) => {
      const orderDate = new Date(order.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groupedOrders[orderDate]) {
        groupedOrders[orderDate] = [];
      }
      groupedOrders[orderDate].push(order);
    });

    // 🟢 Sort orders within each date from recent to old
    Object.keys(groupedOrders).forEach((date) => {
      groupedOrders[date].sort((a, b) => new Date(b.date) - new Date(a.date)); // 🔹 Sort in descending order (recent first)
    });

    return Object.entries(groupedOrders).sort(
      (a, b) => new Date(b[0]) - new Date(a[0])
    ); // 🔹 Sort dates in ascending order
  };

  // 🟢 Flatten the grouped orders for pagination
  const flattenedOrders = groupOrdersByDate().flatMap(([date, ordersOnDate]) => ({
    date,
    ordersOnDate,
  }));

  // 🟢 Get paginated orders from the flattened list
  const paginatedOrders = flattenedOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // 🟢 Change border color based on order status
  const getStatusBorderColor = (status) => {
    switch (status) {
      case "Order Processing":
        return "red"; // Processing - Red
      case "Ready to Takeaway":
        return "orange"; // Ready - Orange
      case "Taken":
        return "green"; // Taken - Green
      default:
        return "gray"; // Default - Gray
    }
  };

  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case "Order Processing":
        return "#f8d7da"; // 🔴 Light Red
      case "Ready to Takeaway":
        return "#fff3cd"; // 🟡 Light Yellow
      case "Taken":
        return "#d4edda"; // 🟢 Light Green
      default:
        return "#f8f9fa"; // Light Gray (for unknown statuses)
    }
  };

  return (
    <div className="order add">
      {/* 🟢 Order List */}
      <div className="order-list">
        {paginatedOrders.map(({ date, ordersOnDate }) => (
          <div key={date}>
            <h4 className="order-date">{date}</h4> {/* Date Header */}
            {ordersOnDate.map((order) => (
              <div
                key={order._id}
                className="order-item"
                style={{
                  borderColor: getStatusBorderColor(order.status),
                  backgroundColor: getStatusBackgroundColor(order.status),
                }}
              >
                <img src={assets.parcel_icon} alt="Parcel" />
                <div>
                  <p className="order-item-food">
                    {order.items.map(
                      (item, index) =>
                        `${item.name} x ${item.quantity}${
                          index < order.items.length - 1 ? ", " : ""
                        }`
                    )}
                  </p>
                  <p className="order-item-name">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <div className="order-item-address">
                    <p>
                      {order.address.houseNo}, {order.address.street}
                    </p>
                    <p>{order.address.zipCode}</p>
                  </div>
                  <p className="order-item-phone">{order.address.phone}</p>
                </div>
                <p>Items: {order.items.length}</p>
                <p>${order.amount}</p>
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                >
                  <option value="Order Processing">Order Processing</option>
                  <option value="Ready to Takeaway">Ready to Takeaway</option>
                  <option value="Taken">Taken</option>
                </select>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 🟢 Pagination Below */}
      <div className="pagination-container">
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            disabled={currentPage * ordersPerPage >= flattenedOrders.length}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
