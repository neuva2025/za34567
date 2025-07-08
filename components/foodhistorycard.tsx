import React from "react";

const FoodHistoryCard: React.FC = () => {
  return (
    <div style={styles.cardContainer}>
      <div style={styles.header}>
        <p style={styles.orderNumber}>ORDER NUMBER</p>
        <p style={styles.orderId}>ZPP-2994984aaHD8</p>
      </div>
      <div style={styles.body}>
        <p style={styles.itemCount}>1 item delivered on:</p>
        <p style={styles.deliveryDate}>12/12/2024</p>
        <div style={styles.imageContainer}>
          <img
            src="https://via.placeholder.com/150" // Replace with the burger image URL
            alt="Burger"
            style={styles.image}
          />
          <p style={styles.itemName}>Burger</p>
          <p style={styles.restaurantName}>(EMO Pizza)</p>
        </div>
      </div>
      <div style={styles.footer}>
        <button style={styles.reorderButton}>REORDER</button>
      </div>
    </div>
  );
};

const styles = {
  cardContainer: {
    width: "90%",
    maxWidth: "300px",
    margin: "0 auto",
    padding: "16px",
    backgroundColor: "#f3f3f3",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center" as const,
    fontFamily: "'Arial', sans-serif",
  },
  header: {
    marginBottom: "8px",
  },
  orderNumber: {
    fontSize: "14px",
    fontWeight: "bold" as const,
    margin: "0",
  },
  orderId: {
    fontSize: "14px",
    margin: "4px 0",
  },
  body: {
    marginBottom: "16px",
  },
  itemCount: {
    fontSize: "12px",
    margin: "0",
  },
  deliveryDate: {
    fontSize: "14px",
    fontWeight: "bold" as const,
    margin: "4px 0",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    marginTop: "8px",
  },
  image: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover" as const,
  },
  itemName: {
    fontSize: "14px",
    fontWeight: "bold" as const,
    margin: "8px 0 0",
  },
  restaurantName: {
    fontSize: "12px",
    color: "#555",
    margin: "4px 0",
  },
  footer: {
    marginTop: "16px",
  },
  reorderButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#FF6600",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold" as const,
    border: "none",
    borderRadius: "4px",
    cursor: "pointer" as const,
  },
};

export default FoodHistoryCard;
