/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import "./Menu.css";
import { StoreContext } from "../../context/StoreContext";

const Menu = ({ category, setCategory }) => {
  const { url, category_list } = useContext(StoreContext);

  return (
    <div className="menu" id="menu">
      <h1>Explore our menu</h1>
      <p className="menu-text">Choose from diverse menu</p>
      <div className="menu-list">
        {category_list.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) => (prev === item.name ? "All" : item.name))
              }
              key={item._id}
              className="menu-list-item"
            >
              <img
                className={`category-image ${
                  category === item.name ? "active" : ""
                }`}
                src={`${url}/categoryimages/${item.image}`}
                alt={item.name}
              />
              <p>{item.name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default Menu;
