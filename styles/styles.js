import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    // This style is no longer the main container but kept for reference
    flex: 1,
    backgroundColor: "#fff",
  }, // Style for full-screen background image and gradient overlay
  bgImage: {
    flex: 1, // Crucial for taking up the entire screen space
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  }, // Style for the centered login form container

  loginContainer: {
    width: "90%",
    maxWidth: 400,
    padding: 24,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 18,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#333",
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  checkIcon: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 18,
  },

  checkboxLabel: {
    fontSize: 16,
    color: "#222",
  },

  loginButton: {
    backgroundColor: "#002365",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // styles.js snippet (ensure this is present for the back button)
  backButton: {
    marginTop: 12,
    color: "#007bff", // Standard link blue color
    fontSize: 16,
    textDecorationLine: "underline", // Makes it look like a web link
    fontWeight: "500",
    textAlign: "center",
    padding: 8,

  },
  roleField: {
    // Visual match for TextInput:
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 18,
    borderRadius: 6,
    fontSize: 16,
    // Styling for non-editable appearance (matches glassmorphic theme):
    justifyContent: "center",
    // Subtle semi-transparent white background to indicate fixed value
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    minHeight: 48, // Ensures proper vertical alignment
  },
  registerLinkContainer: {
    marginTop: 16,
    alignItems: 'center', // Center the text horizontally
    padding: 8,
  },

  registerLinkText: {
    color: "#007bff", // Standard link blue color
    fontSize: 16,
    textDecorationLine: "underline", // Makes it look like a web link
    fontWeight: "500",
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#333",
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    justifyContent: "center", // Vertical centering
    alignItems: "center",     // Horizontal centering
  },
  checkboxChecked: {
    backgroundColor: "#007bff", // Blue background when checked
    borderColor: "#007bff",   // Blue border when checked
  },
  checkIcon: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",     // Checkmark color white
    lineHeight: 18,   // Fix for vertical centering
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#222",
  },
});
