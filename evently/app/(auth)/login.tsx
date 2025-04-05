import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Stack } from "expo-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login(username, password);
      router.replace("/(tabs)/Home");
    } catch (error) {
      Alert.alert("Login Failed Invalid credentials");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20, textAlign: "center" }}>
          Login
        </Text>

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

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? "#ccc" : "#010101",
            height: 48,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "white", fontSize: 16 }}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={{ marginTop: 15, textAlign: "center", color: "#010101" }}>
          Don't have an account?
          <Link href="/register" style={{ color: "#A0D195" }}>
            {" "}
            Register
          </Link>
        </Text>
      </View>
    </>
  );
}
