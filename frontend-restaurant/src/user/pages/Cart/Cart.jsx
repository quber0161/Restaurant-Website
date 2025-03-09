/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);
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

            // 🟢 Calculate total price for extras dynamically
            const extrasCost = cartItem.extras.reduce((total, extra) => {
              const extraDetails = food_list
                .flatMap((f) => f.extras || [])
                .find((e) => e._id === extra._id);
              return (
                total + (extraDetails ? extraDetails.price * extra.quantity : 0)
              );
            }, 0);

            // 🟢 Compute total price dynamically
            const totalPrice = (item.price + extrasCost) * cartItem.quantity;

            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/foodimages/" + item.image} alt="" />
                  <div>
                    <p className="item-name">{item.name}</p>
                    <p className="cart-extras">
                      <b>Extras:</b>
                      {cartItem.extras.map((extra, idx) => {
                        const extraDetails = food_list
                          .flatMap((f) => f.extras || [])
                          .find((e) => e._id === extra._id);
                        const extraName = extraDetails
                          ? extraDetails.name
                          : "Unknown Extra";
                        const extraPrice = extraDetails
                          ? extraDetails.price * extra.quantity
                          : 0;
                        return (
                          <span key={extra._id}>
                            {extraName} x {extra.quantity} ($
                            {extraPrice})
                            {idx < cartItem.extras.length - 1 ? ", " : ""}
                          </span>
                        );
                      })}
                    </p>

                    {/* 🟢 Show comment if available */}
                    {cartItem.comment && (
                      <p className="cart-comment">
                        <b>Note:</b> {cartItem.comment}
                      </p>
                    )}
                  </div>
                  <p>${item.price}</p>
                  <p>{cartItem.quantity}</p>
                  <p>${totalPrice}</p>{" "}
                  {/* 🟢 Total price updates dynamically */}
                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
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
          <Link to="/order">
            <button>PROCEED TO CHECKOUT</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
