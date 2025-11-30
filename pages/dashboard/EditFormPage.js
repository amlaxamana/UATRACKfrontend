import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import { colors } from "../../styles/colors";

import { Picker } from "@react-native-picker/picker";

export default function DashboardPage({ navigation, route }) {
  const routeData = route.params;

  const role = localStorage.getItem("role");

  const office = localStorage.getItem("office");

  const authToken = localStorage.getItem("authToken");

  const [fileName, setFileName] = useState("");

  const [editData, setEditData] = useState({
    event_name: "",
    contact_person: "",
    event_date: "",
    attach_document: null,
    organization: routeData.organization,
  });

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

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

  const putData = async () => {
    try {
      const formData = new FormData();
      formData.append("event_name", editData.event_name);
      formData.append("contact_person", editData.contact_person);
      formData.append("event_date", editData.event_date);
      formData.append("organization", editData.organization);

      // Attach file only if exists
      if (editData.attach_document) {
        formData.append("attach_document", editData.attach_document);
      }

      const response = await axios.put(
        `http://127.0.0.1:8000/api/Events/${routeData.id}/`,
        formData
        // {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //     Authorization: `${authToken}`,
        //   },
        // }
      );

      console.log(response.data);
    } catch (error) {
      console.error("Error saving data:", error.response?.data || error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Event Name:"
        onChangeText={(text) => handleChange("event_name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Person:"
        onChangeText={(text) => handleChange("contact_person", text)}
      />

      {/* Date Picker */}
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
            placeholder="e.g., 2024-12-31 (Mobile: use native picker)"
            value={editData.event_date}
            onChangeText={(text) => handleChange("event_date", text)}
          />
        )}
      </View>

      {/* File Upload Section */}
      <View style={styles.filePickerSection}>
        {Platform.OS === "web" ? (
          <View>
            <Text style={{ marginBottom: 5, fontWeight: "bold" }}>
              Attach Document:
            </Text>
            <input type="file" onChange={handleWebFileChange} />
          </View>
        ) : (
          <Button
            title="Select Document (Mobile)"
            onPress={() => alert("Use DocumentPicker for Mobile")}
          />
        )}

        <Text style={styles.fileNameText}>
          {fileName ? `File selected: ${fileName}` : "No file selected."}
        </Text>
      </View>

      {role === "admin" && office === "OSA" ? (
        <View>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValue(itemValue)
            }
          >
            <Picker.Item label="Option 1" value="value1" />
            <Picker.Item label="Option 2" value="value2" />
            <Picker.Item label="Option 3" value="value3" />
          </Picker>
        </View>
      ) : (
        ""
      )}

      <View style={{ marginVertical: 20 }}>
        <Button title="Save" onPress={putData} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100vh",
    backgroundColor: colors.surface,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
    padding: 10,
    borderRadius: 6,
  },
  datePickerContainer: {
    marginVertical: 10,
  },
  datePickerLabel: {
    marginBottom: 5,
    fontWeight: "600",
  },
  webDateInput: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
  },
  filePickerSection: {
    marginVertical: 20,
  },
  fileNameText: {
    marginTop: 8,
    color: "#444",
  },
});
