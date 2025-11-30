import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
// 👈 ADDED: Import AsyncStorage to get the current user's ID/Token
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { colors } from "../../styles/colors"; // Assuming you have a styles/colors.js

// --- Component ---

export default function EditUserInfo({ navigation }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "", // Not recommended for a simple form, but included for completeness
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // 1. Get current user's ID and Auth Token from storage
    const fetchUserData = async () => {
      try {
        const id = await AsyncStorage.getItem("user_id");
        const token = await AsyncStorage.getItem("authToken");

        if (id && token) {
          setUserId(id);
          // 2. Fetch the specific user's current data
          // Adjust your API URL to fetch a single user by ID
          const response = await axios.get(
            `http://127.0.0.1:8000/api/Users/${id}/`, 
            {
              headers: {
                Authorization: `Token ${token}`, // Assuming token authentication
              },
            }
          );

          const userData = response.data;
          setFormData({
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            email: userData.email || "",
            password: "", // Never fetch or display the password
          });
        } else {
          Alert.alert("Error", "User not logged in or missing ID.");
          navigation.navigate("Login");
        }
      } catch (e) {
        console.error("Error fetching user data:", e);
        Alert.alert("Error", "Could not load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!userId) {
      Alert.alert("Error", "Cannot save, user ID is missing.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication token is missing.");
        return;
      }

      // Prepare data for submission - only send fields you want to change
      const dataToSubmit = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        // Only include password if it's been entered by the user
        ...(formData.password && { password: formData.password }), 
      };

      // 3. Make a PATCH request to update the user
      const response = await axios.put( 
        `http://127.0.0.1:8000/api/Users/${userId}/`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Success", "User information updated successfully!");
      console.log("Update response:", response.data);

      // Optionally, navigate back or refresh the view
      navigation.goBack(); 

    } catch (error) {
      console.error("Update failed:", error.response ? error.response.data : error.message);
      Alert.alert("Update Failed", "There was an error updating your information.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading User Data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Your Information</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.first_name}
        onChangeText={(text) => handleChange("first_name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.last_name}
        onChangeText={(text) => handleChange("last_name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
      />
      
      {/* Basic password field - user must re-enter if they want to change it */}
      <TextInput
        style={styles.input}
        placeholder="New Password (leave blank to keep current)"
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
      />

      <Button title="Save Changes" onPress={handleSave} />
      <Button title="Go Back" onPress={() => navigation.goBack()} color={colors.secondary} />
    </View>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.primary,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
});
