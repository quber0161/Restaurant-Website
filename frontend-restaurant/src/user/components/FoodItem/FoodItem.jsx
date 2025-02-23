/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image, extras = [] }) => {
  const { addToCart, url } = useContext(StoreContext);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [comment, setComment] = useState("");

  // 🟢 Handle Extra Ingredients Selection
  const handleExtraChange = (extra) => {
    setSelectedExtras(
      selectedExtras.includes(extra)
        ? selectedExtras.filter((item) => item !== extra)
        : [...selectedExtras, extra]
    );
  };

  // 🟢 Handle Add to Cart
  const handleAddToCart = () => {
    addToCart(id, selectedExtras, comment);
    setShowPopup(false);
    setSelectedExtras([]);
    setComment("");
  };

  return (
    <div className="food-item">
      <div className="food-item-image-container">
        <img
          className="food-item-image"
          src={url + "/foodimages/" + image}
          alt=""
        />
        <img
          className="addicon"
          onClick={() => setShowPopup(true)}
          src={assets.add_icon_white}
          alt="Add to Cart"
        />
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
                    <label key={index}>
                      <input
                        type="checkbox"
                        value={extra._id} // ✅ Use _id instead of full object
                        checked={selectedExtras.some(
                          (e) => e._id === extra._id
                        )}
                        onChange={() => handleExtraChange(extra)}
                      />
                      {extra.name} (+${extra.price}){" "}
                      {/* ✅ Properly access name & price */}
                    </label>
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
