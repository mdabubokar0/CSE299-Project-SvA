import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = "http://172.20.10.2:8081";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login(username, password);
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Login Failed Invalid credentials');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
      />
      
      <TouchableOpacity 
        onPress={handleLogin}
        disabled={isLoading}
        style={{ 
          backgroundColor: isLoading ? '#ccc' : 'blue', 
          padding: 15, 
          alignItems: 'center',
          borderRadius: 5
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: 'white' }}>Login</Text>
        )}
      </TouchableOpacity>
      
      <Link href="/register" style={{ marginTop: 15, textAlign: 'center', color: 'blue' }}>
        Don't have an account? Register
      </Link>
    </View>
  );
}