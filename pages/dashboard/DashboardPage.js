import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import NavBar from "../componentsFolder/NavBar";
import { useEffect, useState } from "react";
import axios from "axios";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import StudentDashboardPage from "./components/StudentDashboard";
import AdminDashboardPage from "./components/AdminDashboard";

export default function DashboardPage({ navigation }) {
  // sample user role logic
  const role = localStorage.getItem("role");
  const organization = localStorage.getItem("organization");
  const name = localStorage.getItem("name");

  console.log("Role in Dashboard:", role);
  let text = "";
  if (role !== "student") {
    text = "Admin Dashboard";
  } else {
    text = "Student Dashboard";
  }

  return (
    <View style={styles.container}>
      <NavBar text={text} />
      <SafeAreaProvider>
        <SafeAreaView style={styles.scrollContainer} edges={["top"]}>
          <ScrollView style={{}}>
            <View style={{ margin: 24 }}>
              <Text style={[styles.text, { color: colors.primary }]}>
                Welcome, {name}
              </Text>
            </View>

            {role === "admin" ? (
              <AdminDashboardPage navigation={navigation} />
            ) : (
              <StudentDashboardPage navigation={navigation} />
            )}
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </View>
  );
}

import { colors } from "../../styles/colors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
  },
  scrollContainer: {
    height: "100vh",
    paddingBottom: 100,
  },
  text: {
    fontSize: 24,
    fontWeight: 600,
  },
});
