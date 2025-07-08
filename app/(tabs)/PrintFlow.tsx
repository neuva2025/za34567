import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

// Types for our application
interface PrintJob {
  id: string;
  fileName: string;
  preferences: string[];
  pageCount: number;
  price: number;
}

// PrintOutsPage Component
export const PrintOutsPage = () => {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type === "application/pdf") {
        const printJob: PrintJob = {
          id: Date.now().toString(),
          fileName: file.name,
          preferences: [],
          pageCount: 0, // You would need to implement PDF page counting
          price: 0, // Initial price before preferences
        };

        sessionStorage.setItem("currentPrintJob", JSON.stringify(printJob));
        router.push("/pagepreference");
      } else {
        Alert.alert("Invalid File", "Please upload PDF files only.");
      }
    },
    [router]
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropZone}
        onPress={() => Alert.alert("File Upload", "File upload is handled differently in mobile apps.")}
      >
        <Text style={styles.dropZoneText}>DROP PDF FILES HERE</Text>
      </TouchableOpacity>
    </View>
  );
};

// PagePreference Component
export const PagePreference = () => {
  const router = useRouter();
  const [preferences, setPreferences] = useState({
    printType: "",
    orientation: "",
    paperType: "",
    binding: "",
  });

  const handlePreferenceChange = (category: string, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmit = () => {
    const printJobStr = sessionStorage.getItem("currentPrintJob");
    if (printJobStr) {
      const printJob: PrintJob = JSON.parse(printJobStr);
      printJob.preferences = Object.values(preferences).filter(Boolean);
      sessionStorage.setItem("currentPrintJob", JSON.stringify(printJob));
      router.push("/printcard");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Print Preferences</Text>
      {/* Add your preference input UI here */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continue to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

// PrintCard Component
export const PrintCard = () => {
  const [printJobs, setPrintJobs] = useState<PrintJob[]>(() => {
    const currentJob = sessionStorage.getItem("currentPrintJob");
    return currentJob ? [JSON.parse(currentJob)] : [];
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {printJobs.map((job) => (
        <View key={job.id} style={styles.cartItem}>
          <Text style={styles.itemTitle}>{job.fileName}</Text>
          <Text>{job.pageCount} pages</Text>
          <Text>{job.preferences.join(", ")}</Text>
          <Text>₹{job.price}</Text>
        </View>
      ))}
      <View style={styles.totalContainer}>
        <Text>Total: ₹{printJobs.reduce((sum, job) => sum + job.price, 0)}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Proceed to Pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  dropZone: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#666",
  },
  dropZoneText: {
    color: "#fff",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  cartItem: {
    backgroundColor: "#1e1e1e",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  totalContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
  },
});

export default { PrintOutsPage, PagePreference, PrintCard };
