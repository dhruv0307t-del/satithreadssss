"use client";

import Image from "next/image";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, addToCart } = useCart();

  const removeItem = (id: string) => {
    addToCart({ id, title: "", price: 0, image: "", qty: -1 });
  };

  const clearCart = () => {
    cart.forEach((item) =>
      addToCart({ ...item, qty: -item.qty })
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <section className="cart-page">
      <h1 className="cart-title">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="empty-cart-text">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-row" key={item.id}>
                <div className="cart-img">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                  />
                </div>

                <div className="cart-info">
                  <h3>{item.title}</h3>
                  <p>Qty: {item.qty}</p>
                  <p>Rs. {item.price}</p>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Total: Rs. {total}</h2>

            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>

            <button className="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
}
