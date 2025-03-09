/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image, extras = [] }) => {
  const { addToCart, url } = useContext(StoreContext);
  
  const [showPopup, setShowPopup] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [comment, setComment] = useState("");

  // 🟢 Increase Extra Quantity
  const increaseExtra = (extraId) => {
    setSelectedExtras((prev) => ({
      ...prev,
      [extraId]: (prev[extraId] || 0) + 1,
    }));
  };

  // 🟢 Decrease Extra Quantity
  const decreaseExtra = (extraId) => {
    setSelectedExtras((prev) => {
      if (!prev[extraId] || prev[extraId] === 0) return prev;
      const newExtras = { ...prev };
      newExtras[extraId] -= 1;
      if (newExtras[extraId] === 0) delete newExtras[extraId]; // Remove if quantity is 0
      return newExtras;
    });
  };

  // 🟢 Handle Add to Cart
  const handleAddToCart = () => {
    const formattedExtras = Object.entries(selectedExtras)
      .filter(([_, quantity]) => quantity > 0)
      .map(([extraId, quantity]) => ({
        _id: extraId,
        quantity: quantity,
      }));

    addToCart(id, formattedExtras, comment);
    setShowPopup(false);
    setSelectedExtras({});
    setComment("");
  };

  return (
    <div className="food-item">
      <div className="food-item-image-container">
        <img className="food-item-image" src={url + "/foodimages/" + image} alt="" />
        <img className="addicon" onClick={() => setShowPopup(true)} src={assets.add_icon_white} alt="Add to Cart" />
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-description">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>

      {/* 🟢 Popup for Customization */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Customize Your Order</h3>
            {extras.length > 0 ? (
              <>
                <p>Select Extra Ingredients:</p>
                <div className="extra-options">
                  {extras.map((extra, index) => (
                    <div key={index} className="extra-item">
                      <p>{extra.name} (+${extra.price})</p>
                      <div className="extra-quantity">
                        <button onClick={() => decreaseExtra(extra._id)}>-</button>
                        <span>{selectedExtras[extra._id] || 0}</span>
                        <button onClick={() => increaseExtra(extra._id)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="no-extras">No extra ingredients available.</p>
            )}

            <textarea
              placeholder="Add special instructions (e.g., no tomatoes, extra jalapeños)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <div className="popup-buttons">
              <button onClick={() => setShowPopup(false)}>Cancel</button>
              <button onClick={handleAddToCart}>Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItem;
