import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../styles/styles";

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // Checkbox state

  // State for press/hover effects
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isLinkPressed, setIsLinkPressed] = useState(false);

  const handleLogin = () => {
    // Dummy login action
    alert(`Email: ${email}\nPassword: ${password}\nRemember Me: ${rememberMe}`);
  };

  return (
    <ImageBackground
      source={require("../../assets/bg.jpg")}
      style={styles.bgImage}
    >
      <LinearGradient
        colors={["rgba(0, 35, 101, 0.4)", "rgba(255, 255, 255, 0.7)"]}
        style={styles.bgImage}
      >
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Login</Text>

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

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setRememberMe((prev) => !prev)} // Toggles the state
            activeOpacity={0.7}
          >
            {/* APPLYING CONDITIONAL STYLE HERE FOR CHECKED APPEARANCE */}
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
            >
              {/* Only show the checkmark if rememberMe is true */}
              {rememberMe && <Text style={styles.checkIcon}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Remember Me</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPressIn={() => setIsButtonPressed(true)}
            onPressOut={() => setIsButtonPressed(false)}
            onPress={handleLogin}
            style={[
              styles.loginButton,
              isButtonPressed && styles.loginButtonHover
            ]}
          >
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={styles.registerLinkContainer}
            onPressIn={() => setIsLinkPressed(true)}
            onPressOut={() => setIsLinkPressed(false)}
          >
            <Text
              style={[
                styles.registerLinkText,
                isLinkPressed && styles.registerLinkTextHover
              ]}
            >
              Don't have an account? Register
            </Text>
          </TouchableOpacity>

        </View>
      </LinearGradient>
    </ImageBackground>
  );
}