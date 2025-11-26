import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
<<<<<<< HEAD
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
=======
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
>>>>>>> 00bfdbffc3ab7dc1ddf08509a364c3d5bfe8f7fa
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
<<<<<<< HEAD
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
=======
  },
  checkboxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    marginLeft: 0,
    marginBottom: 24,
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,

  checkIcon: {
    fontSize: 20,       // ✔ big check mark
    fontWeight: "bold",
    color: "#000",
    lineHeight: 22,     // ✔ ensures perfect vertical centering
    textAlign: "center" // ✔ horizontal centering
  },

  },
  roleField: {
>>>>>>> 00bfdbffc3ab7dc1ddf08509a364c3d5bfe8f7fa
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 18,
    borderRadius: 6,
    fontSize: 16,
<<<<<<< HEAD
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
=======
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
>>>>>>> 00bfdbffc3ab7dc1ddf08509a364c3d5bfe8f7fa
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
<<<<<<< HEAD
    borderWidth: 2,
=======
    borderWidth: 1,
>>>>>>> 00bfdbffc3ab7dc1ddf08509a364c3d5bfe8f7fa
    borderColor: "#333",
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
<<<<<<< HEAD
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
=======
  },
  checkboxChecked: {
    backgroundColor: "#007bff",
>>>>>>> 00bfdbffc3ab7dc1ddf08509a364c3d5bfe8f7fa
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#222",
  },
<<<<<<< HEAD
=======
  backButton: {
    marginTop: 12,
    textDecorationLine: "underline",
    color: "#007bff",
    fontFamily: "system-ui",
    width: "fit-content",
    textAlign: "center",
    padding: 8,
    marginLeft: "auto",
    marginRight: "auto",
  },

  bg: {
  flex: 1,
  width: 40,
  height: 40,
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

>>>>>>> 00bfdbffc3ab7dc1ddf08509a364c3d5bfe8f7fa
});
