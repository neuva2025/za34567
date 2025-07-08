import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { auth, db } from "../../firebase/Config";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

const App = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [regNo, setRegNo] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [batch, setBatch] = useState<number>(1);
  const [srmEmail, setSrmEmail] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<string>("login");

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      Alert.alert("Verification Email Sent", "Please check your inbox to verify your email.");

      // Add user details to Firestore
      await addDoc(collection(db, "USERS"), {
        uid: user.uid,
        email: user.email,
        name,
        regNo,
        phoneNo,
        batch,
        srmEmail,
        createdAt: new Date(),
      });

      setCurrentPage("verifyEmail");
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert("Error", "Please verify your email first.");
        return;
      }

      // Navigate to HomeScreen on successful login
      router.push("/HomeScreen");
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Password Reset", "Check your email to reset your password.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  const renderContent = () => {
    switch(currentPage) {
      case "login":
        return (
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.header}>Login</Text>
              <View style={styles.formContainer}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter Email"
                  keyboardType="email-address"
                  style={styles.input}
                  autoCapitalize="none"
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter Password"
                  secureTextEntry
                  style={styles.input}
                />
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={handleLogin}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCurrentPage("signUp")}>
                  <Text style={styles.redirectText}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCurrentPage("passwordReset")}>
                  <Text style={styles.redirectText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        );
      
      case "signUp":
        return (
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.header}>Create Account</Text>
              <View style={styles.formContainer}>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter Name"
                  style={styles.input}
                />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter Email"
                  keyboardType="email-address"
                  style={styles.input}
                  autoCapitalize="none"
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter Password"
                  secureTextEntry
                  style={styles.input}
                />
                <TextInput
                  value={regNo}
                  onChangeText={setRegNo}
                  placeholder="Enter Registration Number"
                  style={styles.input}
                />
                <TextInput
                  value={phoneNo}
                  onChangeText={setPhoneNo}
                  placeholder="Enter Phone Number"
                  style={styles.input}
                  keyboardType="phone-pad"
                />
                <TextInput
                  value={srmEmail}
                  onChangeText={setSrmEmail}
                  placeholder="Enter SRM Email"
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={handleSignUp}
                >
                  <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCurrentPage("login")}>
                  <Text style={styles.redirectText}>Already have an account? Login</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        );
      
      case "verifyEmail":
        return (
          <View style={styles.container}>
            <Text style={styles.header}>Please Verify Your Email</Text>
            <Text style={styles.text}>
              A verification email has been sent to your email address. 
              Please check your inbox to verify your account.
            </Text>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => setCurrentPage("login")}
            >
              <Text style={styles.buttonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        );
      
      case "passwordReset":
        return (
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.header}>Reset Password</Text>
              <View style={styles.formContainer}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter Email"
                  keyboardType="email-address"
                  style={styles.input}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={handlePasswordReset}
                >
                  <Text style={styles.buttonText}>Send Password Reset Email</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCurrentPage("login")}>
                  <Text style={styles.redirectText}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        );
      
      default:
        return <View />;
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 40
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#000000",
  },
  input: {
    backgroundColor: "#F8F8F8",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  button: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  redirectText: {
    color: "#000000",
    textAlign: "center",
    marginTop: 15,
    textDecorationLine: "underline",
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#333333",
    lineHeight: 24,
  },
});

export default App;