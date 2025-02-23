/* eslint-disable no-unused-vars */
import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom"; // 🟢 Import useNavigate

const Header = () => {
  const navigate = useNavigate(); // 🟢 Hook for navigation

  return (
    <div className="header">
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest ingredients. Our mission is to satisfy your
          cravings and elevate your dining experience, one delicious meal at a time.
        </p>
        <button onClick={() => navigate("/menu")}>View Menu</button> {/* 🟢 Navigate to menu page */}
      </div>
    </div>
  );
};

export default Header;
