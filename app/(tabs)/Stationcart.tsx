import React, { useState } from "react";

const StationCart: React.FC = () => {
  // Sample cart data
  const initialCart = [
    { id: 1, name: "Borito Gel Pen", price: 10, quantity: 3 },
    { id: 2, name: "Borito Gel Pen", price: 10, quantity: 2 },
    { id: 3, name: "Borito Gel Pen", price: 10, quantity: 1 },
  ];

  const [cartItems, setCartItems] = useState(initialCart);

  const increment = (id: number) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrement = (id: number) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Calculate stationery cost, delivery charge, and total
  const stationeryCost = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryCharge = Math.ceil(stationeryCost * 0.1); // 10% of stationery cost
  const totalCost = stationeryCost + deliveryCharge;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "1rem",
        position: "relative",
      }}
    >
      {/* Cart Header */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "white",
          backgroundColor: "black",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
        }}
      >
        Your Cart
      </div>

      {/* Cart Items */}
      <div
        style={{
          borderRadius: "16px",
          backgroundColor: "#f5f5f5",
          padding: "1rem",
          marginTop: "60px", // Adjust for header
        }}
      >
        {cartItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
              backgroundColor: "#d9d9d9",
              padding: "1rem",
              borderRadius: "16px",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {/* Product Details */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="https://via.placeholder.com/50"
                alt="Product"
                style={{
                  width: "50px",
                  height: "50px",
                  marginRight: "1rem",
                  borderRadius: "8px",
                }}
              />
              <div>
                <h3 style={{ margin: 0 }}>{item.name}</h3>
                <p style={{ margin: 0, color: "#666" }}>₹{item.price}</p>
              </div>
            </div>

            {/* Increment/Decrement Buttons */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={() => decrement(item.id)}
                style={{
                  backgroundColor: "#820909",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "0.5rem",
                }}
              >
                -
              </button>
              <span style={{ margin: "0 0.5rem" }}>{item.quantity}</span>
              <button
                onClick={() => increment(item.id)}
                style={{
                  backgroundColor: "#820909",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cost Summary */}
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          <span>Stationery Cost:</span>
          <span>₹{stationeryCost}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          <span>Delivery Charge:</span>
          <span>₹{deliveryCharge}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          <span>Total:</span>
          <span>₹{totalCost}</span>
        </div>
      </div>

      {/* Pay Button */}
      <button
        style={{
          width: "100%",
          padding: "1rem",
          backgroundColor: "#820909",
          color: "white",
          fontSize: "1.2rem",
          fontWeight: "bold",
          border: "none",
          borderRadius: "16px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
          cursor: "pointer",
        }}
        onClick={() => alert("Proceed to Payment")}
      >
        PAY ₹{totalCost}
      </button>
    </div>
  );
};

export default StationCart;
