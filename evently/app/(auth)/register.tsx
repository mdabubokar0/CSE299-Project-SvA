import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Stack, router } from "expo-router";

const Register = () => {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("attendee"); // Default to 'attendee'
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await register(name, username, role, password);
      router.replace("/login");
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        "Please check your details and try again"
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20, textAlign: "center" }}>
          Register
        </Text>

        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={{
            borderWidth: 0.5,
            height: 48,
            padding: 12,
            marginBottom: 10,
            borderRadius: 50,
          }}
          placeholderTextColor="#c4c4c4" // Set placeholder text color here
        />

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={{
            borderWidth: 0.5,
            height: 48,
            padding: 12,
            marginBottom: 10,
            borderRadius: 50,
          }}
          placeholderTextColor="#c4c4c4" // Set placeholder text color here
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderWidth: 0.5,
            height: 48,
            padding: 12,
            marginBottom: 10,
            borderRadius: 50,
          }}
          placeholderTextColor="#c4c4c4" // Set placeholder text color here
        />

        <TextInput
          placeholder="Role (organizer/photographer/attendee)"
          value={role}
          onChangeText={setRole}
          style={{
            borderWidth: 0.5,
            height: 48,
            padding: 12,
            marginBottom: 10,
            borderRadius: 50,
          }}
          placeholderTextColor="#c4c4c4" // Set placeholder text color here
        />

        <TouchableOpacity
          onPress={handleRegister}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? "#ccc" : "#010101",
            height: 48,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>
            {isLoading ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Register;
