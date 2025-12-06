import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Platform, ScrollView } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { colors } from "../../styles/colors";

// --- GLASS THEME COLORS ---
const GLASS_THEME = {
  glassSurface: "rgba(255, 255, 255, 0.85)", // More opaque for readability
  glassText: "#001e66", // Dark text on light glass
  glassBorder: "rgba(0, 30, 102, 0.3)", // Dark blue border
  darkBlue: "#005BCC",
  lightBlue: "#007AFF",
  white: "#FFFFFF",
  softGray: "#E0E5F2",
};

export default function EditUserInfo({ navigation }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Modals
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (msg) => {
    setModalMessage(msg);
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 1800);
  };

  // Load user info
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = await AsyncStorage.getItem("user_id");
        const token = await AsyncStorage.getItem("authToken");

        if (id && token) {
          setUserId(id);

          const response = await axios.get(
            `http://127.0.0.1:8000/api/Users/${id}/`,
            { headers: { Authorization: `Token ${token}` } }
          );

          const userData = response.data;

          // Autofill the form
          setFormData({
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            email: userData.email || "",
            password: "",
          });

          // Save original for change comparison
          setOriginalData({
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            email: userData.email || "",
          });

        } else {
          showModal("User authentication missing.");
          navigation.navigate("Login");
        }
      } catch (e) {
        console.error("Error fetching user data:", e);
        showModal("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!userId) {
      showModal("Cannot save, user ID missing.");
      return;
    }

    // Check for changes
    const changesDetected =
      formData.first_name.trim() !== originalData.first_name ||
      formData.last_name.trim() !== originalData.last_name ||
      formData.email.trim() !== originalData.email ||
      formData.password.trim() !== "";

    if (!changesDetected) {
      showModal("No changes detected.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");

      const dataToSubmit = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
      };

      if (formData.password.trim() !== "") {
        dataToSubmit.password = formData.password.trim();
      }

      await axios.put(
        `http://127.0.0.1:8000/api/Users/${userId}/`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Show success modal
      showModal("Changes saved successfully!");

      // Update original data after save
      setOriginalData({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
      });

      // Wait before navigating back (so modal is visible)
      setTimeout(() => {
        navigation.goBack();
      }, 1200);

    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      showModal("Update failed.");
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
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.card}>
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

          <TextInput
        style={styles.input}
        placeholder="New Password (optional)"
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
      />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <View style={styles.saveButtonContent}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </View>
      </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <View style={styles.backButtonContent}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </View>
      </TouchableOpacity>
        </View>

      {/* MODAL */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{modalMessage}</Text>
          </View>
        </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: GLASS_THEME.softGray,
  },
  container: {
    minHeight: "100vh",
    backgroundColor: GLASS_THEME.softGray,
    padding: Platform.OS === 'web' ? 40 : 20,
    paddingBottom: 60,
    alignItems: 'center',
  },
  // Card container styled similar to `loginCard` but with glass surface
  card: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: GLASS_THEME.glassSurface, // exact 0.85 opacity
    padding: 30,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    marginTop: 20,
    alignItems: "center",
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(10px)' }),
    shadowColor: GLASS_THEME.darkBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
    color: GLASS_THEME.glassText,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    marginVertical: 10,
    padding: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: GLASS_THEME.glassSurface,
    color: GLASS_THEME.glassText,
    fontSize: 16,
    fontWeight: "500",
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(5px)' }),
    width: "100%",
    minWidth: 250,
    maxWidth: 440,
  },
  saveButton: {
    marginVertical: 20,
    marginBottom: 10,
    width: "100%",
    maxWidth: 440,
  },
  saveButtonContent: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GLASS_THEME.lightBlue,
    shadowColor: "#001e66",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: GLASS_THEME.white,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  backButton: {
    marginVertical: 10,
    marginBottom: 10,
    width: "100%",
    maxWidth: 440,
  },
  backButtonContent: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffd800",
    borderWidth: 0,
    shadowColor: "#001e66",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  backButtonText: {
    textAlign: "center",
    fontWeight: "700",
    color: GLASS_THEME.glassText,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: GLASS_THEME.glassSurface,
    padding: 24,
    borderRadius: 20,
    minWidth: "70%",
    maxWidth: 400,
    alignItems: "center",
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(10px)' }),
    shadowColor: GLASS_THEME.darkBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "700",
    color: GLASS_THEME.glassText,
    textAlign: "center",
    letterSpacing: 0.3,
  },
});
  