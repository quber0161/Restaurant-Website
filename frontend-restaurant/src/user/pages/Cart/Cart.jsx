/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    loadCartData,
  } = useContext(StoreContext);

  // 🔹 Ensure cart data loads on navigation to cart page
  useEffect(() => {
    window.scrollTo(0, 0);
    // Only load saved cart data if logged in
    if (token) {
      loadCartData(token);
    }
  }, [token]);

  const hasItems = Object.keys(cartItems).length > 0;

  return (
    <div className="cart">
      {!hasItems ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Looks like you have not added anything yet.</p>
          <Link to="/menu">
            <button className="go-shopping-btn">Add food items</button>
          </Link>
        </div>
      ) : (
        <>
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
        {Object.entries(cartItems).map(([key, cartItem]) => {
          const foodItem = food_list.find(
            (product) => product._id === cartItem.itemId
          );

          if (!foodItem) return null;

          const extrasCost = cartItem.extras.reduce(
            (acc, extra) => acc + extra.price * extra.quantity,
            0
          );
          const totalPrice = (foodItem.price + extrasCost) * cartItem.quantity;
          

          return (
            <div key={key}>
              <div className="cart-items-title cart-items-item">
                <img src={url + "/foodimages/" + foodItem.image} alt="" />
                <div>
                  <p className="item-name">{foodItem.name}</p>
                  <p className="cart-extras">
                    <b>Extras:</b>
                    {cartItem.extras.map((extra, index) => {
                      // Find the extra details from food_list
                      const extraDetails = food_list
                        .flatMap((f) => f.extras || [])
                        .find((e) => e._id === extra._id);
                      const extraName = extraDetails
                        ? extraDetails.name
                        : "Unknown Extra";
                      const extraPrice = extraDetails ? extraDetails.price : 0;

                      return (
                        <span key={extra._id}>
                          {extraName} x {extra.quantity} (Kr {(extraPrice * extra.quantity)})
                          {index < cartItem.extras.length - 1 ? ", " : ""}
                        </span>
                      );
                    })}
                  </p>
                  {cartItem.comment && (
                    <p className="cart-comment">
                      <b>Note:</b> {cartItem.comment}
                    </p>
                  )}
                </div>
                <p>Kr {foodItem.price}</p>
                <p>{cartItem.quantity}</p>
                <p>Kr {totalPrice}</p>
                <button
                  className="remove-button"
                  onClick={() => removeFromCart(key)}
                >
                  Remove
                </button>
              </div>
              <hr />
            </div>
          );
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <b>Total</b>
              <b>Kr {getTotalCartAmount()}</b>
            </div>
          </div>
          <Link to="/order">
            <button>PROCEED TO CHECKOUT</button>
          </Link>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default Cart;
