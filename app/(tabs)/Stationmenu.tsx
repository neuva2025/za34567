import React, { useState } from "react";
import Navbar from "../../components/Navbar";

const StationMenu: React.FC = () => {
  const [quantities, setQuantities] = useState<number[]>(Array(10).fill(0));

  const increment = (index: number) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] += 1;
    setQuantities(updatedQuantities);
  };

  const decrement = (index: number) => {
    const updatedQuantities = [...quantities];
    if (updatedQuantities[index] > 0) updatedQuantities[index] -= 1;
    setQuantities(updatedQuantities);
  };

  return (
    <div className="station-menu" style={{ fontFamily: "Arial, sans-serif", position: "relative" }}>
      <Navbar />

      {/* Header Section */}
      <div style={{ padding: "1rem", backgroundColor: "#820909", color: "white", textAlign: "center" }}>
        <h1>Stationary</h1>
      </div>

      {/* Lab Coats Box */}
      <div
        style={{
          margin: "1rem auto",
          backgroundColor: "#f5f5f5",
          padding: "1rem",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "90%",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <h3 style={{ margin: 0, color: "#820909" }}>Lab Coats and Mechanical Coats Available!</h3>
        </div>
        <img
          src="https://via.placeholder.com/80"
          alt="Lab Coat"
          style={{ width: "80px", height: "auto", borderRadius: "8px" }}
        />
      </div>

      {/* Scrollable Content Section */}
      <div
        style={{
          maxHeight: "60vh",
          overflowY: "scroll",
          padding: "1rem",
        }}
      >
        {/* "What is your need?" Section */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ color: "#820909", marginBottom: "1rem" }}>What is your need?</h2>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 0.5rem",
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={`https://via.placeholder.com/40?text=Cat${index + 1}`}
                    alt={`Category ${index + 1}`}
                    style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                  />
                </div>
              ))}
          </div>
          <button
            style={{
              marginTop: "1rem",
              background: "none",
              border: "none",
              color: "#820909",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            See all categories &gt;
          </button>
        </div>

        {/* Products Section */}
        <div>
          <h2 style={{ color: "#820909", marginBottom: "1rem" }}>Products</h2>
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                  backgroundColor: "#f5f5f5",
                  padding: "1rem",
                  borderRadius: "16px",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Product"
                    style={{ width: "50px", height: "50px", marginRight: "1rem" }}
                  />
                  <div>
                    <h3 style={{ margin: 0 }}>Borito Gel Pen</h3>
                    <p style={{ margin: 0, color: "#666" }}>₹10</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    onClick={() => decrement(index)}
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
                  <span style={{ margin: "0 0.5rem" }}>{quantities[index]}</span>
                  <button
                    onClick={() => increment(index)}
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
      </div>
    </div>
  );
};

export default StationMenu;
