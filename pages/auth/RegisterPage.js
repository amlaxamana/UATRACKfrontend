import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground // Needed for the background image
} from "react-native";
// Import LinearGradient
import { LinearGradient } from 'expo-linear-gradient';
import styles from "../../styles/styles"; // Ensure this path is correct

export default function RegisterPage({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const role = "Student"; // default value

  const handleRegister = () => {
    Alert.alert("Registration Attempt", `Name: ${firstName} ${lastName}\nEmail: ${email}\nOrganization: ${organization}\nRole: ${role}`);
    // Add actual registration logic here, e.g., API call
  };

  return (
    // 1. Use ImageBackground as the top-level container for full screen coverage
    <ImageBackground
      source={require("../../assets/bg.jpg")} // Ensure your bg.jpg is in the assets folder
      style={styles.bgImage}
    >
      {/* 2. The LinearGradient must also use the full-screen style to cover the ImageBackground */}
      <LinearGradient
        colors={['rgba(0, 35, 101, 0.4)', 'rgba(255, 255, 255, 0.7)']}
        style={styles.bgImage}
      >
        {/* 3. All registration form elements are wrapped in the centered loginContainer */}
        <View style={styles.loginContainer}>

          <Text style={styles.title}>Register</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Organization"
            value={organization}
            onChangeText={setOrganization}
          />

          {/* Role Field: Styled to match the input fields */}
          <View style={styles.roleField}>
            <Text style={{ fontSize: 16, color: "#333" }}>{role}</Text>
          </View>

          {/* Register Button: Styled using the loginButton styles */}
          <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
            <Text style={styles.loginButtonText}>REGISTER</Text>
          </TouchableOpacity>

          {/* Back Button: Styled using the backButton styles */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>
              Back to Login
            </Text>
          </TouchableOpacity>

        </View>
      </LinearGradient>
    </ImageBackground>
  );
}