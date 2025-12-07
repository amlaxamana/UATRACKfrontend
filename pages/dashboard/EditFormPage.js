import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../styles/colors";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";

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

export default function EditFormPage({ navigation, route }) {
  // State for delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const routeData = route.params;

  const [role, setRole] = useState("");
  const [office, setOffice] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const fetchRole = await AsyncStorage.getItem("role");
      const fetchOffice = await AsyncStorage.getItem("office");
      setRole(fetchRole);
      setOffice(fetchOffice);
    };
    fetchUserData();
  }, []);

  console.log("office:", office);

  const [fileName, setFileName] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [editData, setEditData] = useState({
    organization: "",
    event_name: "",
    contact_person: "",
    event_date: "",
    attach_document: null,
    status_osa: "NS",
    osa_note: "",
    status_vpaa: "NS",
    vpaa_note: "",
    status_finance: "NS",
    finance_note: "",
    status_vpa: "NS",
    vpa_note: "",
    remarks: "",
  });

  // Snapshot of original data for change detection
  const [originalData, setOriginalData] = useState({});

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  // Fetch event data for autofill
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/Events/${routeData.id}/`
        );
        const data = response.data;

        const filledData = {
          organization: data.organization || "",
          event_name: data.event_name || "",
          contact_person: data.contact_person || "",
          event_date: data.event_date || "",
          attach_document: null,
          status_osa: data.status_osa || "NS",
          osa_note: data.osa_note || "",
          status_vpaa: data.status_vpaa || "NS",
          vpaa_note: data.vpaa_note || "",
          status_finance: data.status_finance || "NS",
          finance_note: data.finance_note || "",
          status_vpa: data.status_vpa || "NS",
          vpa_note: data.vpa_note || "",
          remarks: data.remarks || "",
        };

        setEditData(filledData);
        setOriginalData(filledData); // save snapshot

        if (data.attach_document) {
          const parts = data.attach_document.split("/");
          setFileName(parts[parts.length - 1]);
        }
      } catch (error) {
        console.error(
          "Error fetching event data:",
          error.response?.data || error
        );
        setModalMessage("Failed to load event data.");
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 2000);
      }
    };

    if (routeData?.id) fetchEvent();
  }, [routeData?.id]);

  // Handle file input on Web
  const handleWebFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditData({ ...editData, attach_document: file });
      setFileName(file.name);
    } else {
      setEditData({ ...editData, attach_document: null });
      setFileName("");
    }
  };

  const handleMobilePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) return;

      const asset = Array.isArray(result.assets) ? result.assets[0] : result;
      const picked = {
        uri: asset.uri,
        name: asset.name || "document",
        type: asset.mimeType || asset.type || "application/octet-stream",
      };

      setEditData({ ...editData, attach_document: picked });
      setFileName(picked.name);
    } catch (e) {
      console.error("Document pick error", e);
      setModalMessage("Failed to pick document.");
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);
    }
  };

  // Submit edited data (partial update) with proper change detection
  // Delete function for admin
  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/Events/${routeData.id}/`);
      setShowDeleteConfirm(false);
      setModalMessage("Event deleted successfully!");
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.goBack();
      }, 2000);
    } catch (error) {
      setShowDeleteConfirm(false);
      setModalMessage("Delete failed.");
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);
    }
  };
  const putData = async () => {
    const hasChanges = Object.keys(editData).some(
      (key) =>
        (editData[key]?.trim?.() ?? editData[key]) !==
        (originalData[key]?.trim?.() ?? originalData[key])
    );

    if (!hasChanges) {
      setModalMessage("No changes detected.");
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);
      return; // skip PUT request
    }

    try {
      const formData = new FormData();
      Object.keys(editData).forEach((key) => {
        if (key !== "attach_document") {
          if (editData[key] !== null) formData.append(key, editData[key]);
        }
      });

      if (editData.attach_document) {
        if (Platform.OS === "web") {
          formData.append(
            "attach_document",
            editData.attach_document,
            editData.attach_document.name
          );
        } else {
          const fileObj = {
            uri: editData.attach_document.uri,
            name: editData.attach_document.name,
            type: editData.attach_document.type || "application/octet-stream",
          };
          formData.append("attach_document", fileObj);
        }
      }

      await axios.put(
        `http://127.0.0.1:8000/api/Events/${routeData.id}/`,
        formData
      );

      setModalMessage("Changes saved successfully!");
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);

      setOriginalData({ ...editData }); // update snapshot after save
    } catch (error) {
      console.error("Error saving data:", error.response?.data || error);
      setModalMessage("Update failed.");
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
      {/* Delete Confirmation Modal (only for admin) */}
      {role === "admin" && (
        <Modal
          visible={showDeleteConfirm}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Are you sure you want to delete this form?
              </Text>
              <View style={{ flexDirection: "row", gap: 16, marginTop: 16 }}>
                <Pressable style={styles.modalButton} onPress={handleDelete}>
                  <Text style={styles.modalButtonText}>Yes, Delete</Text>
                </Pressable>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => setShowDeleteConfirm(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {/* Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Form Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={editData.event_name}
        onChangeText={(text) => handleChange("event_name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Person"
        value={editData.contact_person}
        onChangeText={(text) => handleChange("contact_person", text)}
      />

      {/* Date Input */}
      <View style={styles.datePickerContainer}>
        <Text style={styles.datePickerLabel}>Event Date (YYYY-MM-DD):</Text>
        {Platform.OS === "web" ? (
          <input
            type="date"
            value={editData.event_date}
            onChange={(e) => handleChange("event_date", e.target.value)}
            style={styles.webDateInput}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="e.g., 2024-12-31"
            value={editData.event_date}
            onChangeText={(text) => handleChange("event_date", text)}
          />
        )}
      </View>

      {/* File Upload */}
      <View style={styles.filePickerSection}>
        {Platform.OS === "web" ? (
          <div>
            <Text style={styles.statusLabel}>
              Attach Document:
            </Text>
            <input type="file" onChange={handleWebFileChange} />
          </div>
        ) : (
          <View>
            <Text style={styles.statusLabel}>Attach Document:</Text>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleMobilePickDocument}
            >
              <Text style={styles.buttonText}>Select Document (Mobile)</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.fileNameText}>
          {fileName ? `File selected: ${fileName}` : "No file selected."}
        </Text>
      </View>

      {/* Conditional fields for admin and office */}
      {role === "admin" && office === "OSA" && (
        <>
          <Text style={styles.statusLabel}>Status OSA:</Text>
          {Platform.OS === "web" ? (
            <select
              style={styles.selectInput}
              value={editData.status_osa}
              onChange={(e) => handleChange("status_osa", e.target.value)}
            >
              <option value="NS">Not Started</option>
              <option value="IP">In Progress</option>
              <option value="C">Completed</option>
            </select>
          ) : (
            <Picker
              selectedValue={editData.status_osa}
              onValueChange={(value) => handleChange("status_osa", value)}
            >
              <Picker.Item label="Not Started" value="NS" />
              <Picker.Item label="In Progress" value="IP" />
              <Picker.Item label="Completed" value="C" />
            </Picker>
          )}
          <TextInput
            style={styles.input}
            placeholder="OSA Note"
            value={editData.osa_note}
            onChangeText={(text) => handleChange("osa_note", text)}
          />
        </>
      )}
      {role === "admin" && office === "VPAA" && (
        <>
          <Text style={styles.statusLabel}>
            Status VPAA:
          </Text>
          {Platform.OS === "web" ? (
            <select
              style={styles.selectInput}
              value={editData.status_vpaa}
              onChange={(e) => handleChange("status_vpaa", e.target.value)}
            >
              <option value="NS">Not Started</option>
              <option value="IP">In Progress</option>
              <option value="C">Completed</option>
            </select>
          ) : (
            <Picker
              selectedValue={editData.status_vpaa}
              onValueChange={(value) => handleChange("status_vpaa", value)}
            >
              <Picker.Item label="Not Started" value="NS" />
              <Picker.Item label="In Progress" value="IP" />
              <Picker.Item label="Completed" value="C" />
            </Picker>
          )}
          <TextInput
            style={styles.input}
            placeholder="VPAA Note"
            value={editData.vpaa_note}
            onChangeText={(text) => handleChange("vpaa_note", text)}
          />
        </>
      )}
      {role === "admin" && office === "FINANCE" && (
        <>
          <Text style={styles.statusLabel}>
            Status FINANCE:
          </Text>
          {Platform.OS === "web" ? (
            <select
              style={styles.selectInput}
              value={editData.status_finance}
              onChange={(e) => handleChange("status_finance", e.target.value)}
            >
              <option value="NS">Not Started</option>
              <option value="IP">In Progress</option>
              <option value="C">Completed</option>
            </select>
          ) : (
            <Picker
              selectedValue={editData.status_finance}
              onValueChange={(value) => handleChange("status_finance", value)}
            >
              <Picker.Item label="Not Started" value="NS" />
              <Picker.Item label="In Progress" value="IP" />
              <Picker.Item label="Completed" value="C" />
            </Picker>
          )}
          <TextInput
            style={styles.input}
            placeholder="Finance Note"
            value={editData.finance_note}
            onChangeText={(text) => handleChange("finance_note", text)}
          />
        </>
      )}
      {role === "admin" && office === "VPA" && (
        <>
          <Text style={styles.statusLabel}>Status VPA:</Text>
          {Platform.OS === "web" ? (
            <select
              style={styles.selectInput}
              value={editData.status_vpa}
              onChange={(e) => handleChange("status_vpa", e.target.value)}
            >
              <option value="NS">Not Started</option>
              <option value="IP">In Progress</option>
              <option value="C">Completed</option>
            </select>
          ) : (
            <Picker
              selectedValue={editData.status_vpa}
              onValueChange={(value) => handleChange("status_vpa", value)}
            >
              <Picker.Item label="Not Started" value="NS" />
              <Picker.Item label="In Progress" value="IP" />
              <Picker.Item label="Completed" value="C" />
            </Picker>
          )}
          <TextInput
            style={styles.input}
            placeholder="VPA Note"
            value={editData.vpa_note}
            onChangeText={(text) => handleChange("vpa_note", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Remarks (Optional)"
            value={editData.remarks}
            onChangeText={(text) => handleChange("remarks", text)}
          />
        </>
      )}
      {/* For non-admins or other offices, show Remarks only */}
      {!(role === "admin" && office === "VPA") && (
        <TextInput
          style={styles.input}
          placeholder="Remarks (Optional)"
          value={editData.remarks}
          onChangeText={(text) => handleChange("remarks", text)}
        />
      )}
      {/* Go Back Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.yellowButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
        {role === "admin" && (
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => setShowDeleteConfirm(true)}
          >
            <Text style={[styles.buttonText, { color: GLASS_THEME.white }]}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={putData}
        >
          <Text style={[styles.buttonText, { color: GLASS_THEME.white }]}>Save Changes</Text>
        </TouchableOpacity>
      </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: GLASS_THEME.softGray,
  },
  container: {
    minHeight: "100vh",
    backgroundColor: GLASS_THEME.softGray,
    padding: Platform.OS === 'web' ? 40 : 20,
    paddingBottom: 60,
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
  },
  datePickerContainer: {
    marginVertical: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    borderRadius: 12,
    backgroundColor: GLASS_THEME.glassSurface,
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(5px)' }),
  },
  datePickerLabel: {
    marginBottom: 10,
    fontWeight: "700",
    color: GLASS_THEME.glassText,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  webDateInput: {
    padding: 12,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    borderRadius: 10,
    backgroundColor: GLASS_THEME.white,
    color: GLASS_THEME.glassText,
    fontSize: 16,
    fontWeight: "500",
  },
  filePickerSection: {
    marginVertical: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    borderRadius: 12,
    backgroundColor: GLASS_THEME.glassSurface,
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(5px)' }),
  },
  fileNameText: {
    marginTop: 12,
    color: GLASS_THEME.glassText,
    fontSize: 14,
    fontWeight: "500",
  },
  statusLabel: {
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
    color: GLASS_THEME.glassText,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  selectInput: {
    padding: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    borderRadius: 12,
    backgroundColor: GLASS_THEME.glassSurface,
    color: GLASS_THEME.glassText,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonContainer: {
    marginVertical: 10,
    flexDirection: "row",
    gap: 10,
  },
  saveButtonContainer: {
    marginVertical: 20,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#001e66",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: GLASS_THEME.lightBlue,
    borderWidth: 0,
  },
  secondaryButton: {
    backgroundColor: GLASS_THEME.glassSurface,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
  },
  yellowButton: {
    backgroundColor: "#ffd800",
    borderWidth: 0,
  },
  deleteButton: {
    backgroundColor: "#cf1a24",
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: GLASS_THEME.glassText,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: GLASS_THEME.glassSurface,
    padding: 24,
    borderRadius: 20,
    width: "80%",
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
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: GLASS_THEME.glassText,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: GLASS_THEME.lightBlue,
    marginTop: 10,
    shadowColor: GLASS_THEME.lightBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  modalButtonText: {
    color: GLASS_THEME.white,
    fontWeight: "600",
    fontSize: 16,
  },
});
