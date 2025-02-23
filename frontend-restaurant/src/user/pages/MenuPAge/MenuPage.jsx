/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./MenuPage.css"; // 🟢 Create a new CSS file for styling if needed
import Menu from "../../components/Menu/Menu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";

const MenuPage = () => {
  const [category, setCategory] = useState("All");

  return (
    <div className="menu-page">
      <Menu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
    </div>
  );
};

export default MenuPage;
