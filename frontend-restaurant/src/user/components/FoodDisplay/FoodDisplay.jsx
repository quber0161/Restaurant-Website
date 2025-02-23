/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
    const { food_list } = useContext(StoreContext);

    return (
        <div className="food-display" id="food-display">
            <h2>Top dishes from our restaurant</h2>
            <div className="food-display-list">
                {food_list.map((item, index) => {
                    if (category==="All" || category === item.category) {
                        return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} extras={item.extras || []} />
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default FoodDisplay;

