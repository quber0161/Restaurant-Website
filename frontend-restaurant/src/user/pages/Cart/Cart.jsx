/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id]) {
            const cartItem = cartItems[item._id];
            const extrasCost = (cartItem.extras?.length || 0) * 2; // Assuming $2 per extra
            const totalPrice = (item.price + extrasCost) * cartItem.quantity;

            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/foodimages/" + item.image} alt="" />
                  <div>
                    <p>{item.name}</p>
                    {/* 🟢 Show selected extras */}
                    {cartItem.extras.length > 0 && (
                      <p className="cart-extras">
                        <b>Extras:</b> {cartItem.extras.map(extra => extra.name).join(", ")}
                      </p>
                    )}
                    {/* 🟢 Show comment/special instructions */}
                    {cartItem.comment && (
                      <p className="cart-comment">
                        <b>Note:</b> {cartItem.comment}
                      </p>
                    )}
                  </div>
                  <p>${item.price}</p>
                  <p>{cartItem.quantity}</p>
                  <p>${totalPrice}</p>
                  <button className="remove-button" onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount()}</b>
            </div>
          </div>
          <Link to='/order'><button>PROCEED TO CHECKOUT</button></Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
