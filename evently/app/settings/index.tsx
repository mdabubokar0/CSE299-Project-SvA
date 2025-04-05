import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; // Assuming you have an auth context
import { API_URL } from "@/context/api";
import { Stack } from "expo-router";

interface UserData {
  name: string;
  username: string;
}

interface UpdateData {
  name: string;
  username: string;
  password?: string;
}

const index = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    username: "",
  });
  const [formData, setFormData] = useState<UpdateData>({
    name: "",
    username: "",
    password: "",
  });
  const { user } = useAuth();
  const token = user?.token || ""; // A fallback empty string or handle the null case

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data);
        setFormData({
          name: response.data.name,
          username: response.data.username,
          password: "",
        });
      } catch (error) {
        Alert.alert("Error", "Failed to fetch user details");
      }
    };

    fetchUserData();
  }, [token]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updateData: UpdateData = {
        name: formData.name,
        username: formData.username,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await axios.patch(`${API_URL}/api/update`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: keyof UpdateData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerBackTitle: "Back",
          headerTintColor: "#000",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.header}>Profile</Text>

        <ScrollView>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Update Profile</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder={userData.name || "Enter full name"}
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
                placeholderTextColor={"#c4c4c4"} // Set placeholder text color here
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder={userData.username || "Enter username"}
                value={formData.username}
                onChangeText={(text) => handleChange("username", text)}
                placeholderTextColor={"#c4c4c4"} // Set placeholder text color here
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password (optional)"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                placeholderTextColor={"#c4c4c4"} // Set placeholder text color here
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleUpdate}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Updating..." : "Update Profile"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#010101",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default index;
