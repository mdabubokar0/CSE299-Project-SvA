import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "react-native-image-picker";
import axios from "axios";
import { API_URL } from "@/context/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";

type FormData = {
  title: string;
  price: string; // Changed to string for input handling
  type: string;
  thumbnail: ImagePicker.Asset | null;
};

const Create = () => {
  const [file, setFile] = useState<ImagePicker.Asset | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    price: "",
    type: "",
    thumbnail: null,
  });

  const navigation = useNavigation();

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: "photo",
        quality: 1,
        maxWidth: 800,
        maxHeight: 800,
        includeBase64: false,
      });

      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert("Error", result.errorMessage || "Failed to pick image");
        return;
      }

      // Type guard to ensure assets exists and has at least one item
      if (!result.assets || result.assets.length === 0) {
        Alert.alert("Error", "No image selected");
        return;
      }

      const selectedAsset = result.assets[0];
      if (!selectedAsset.uri) {
        Alert.alert("Error", "Selected image has no URI");
        return;
      }

      setFile(selectedAsset);
      setFormData((prev) => ({
        ...prev,
        thumbnail: selectedAsset,
      }));
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error("Image picker error:", error);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.thumbnail) {
      Alert.alert("Error", "Please upload a thumbnail.");
      return;
    }

    if (!formData.title || !formData.price || !formData.type) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("price", formData.price);
      data.append("type", formData.type);

      // For React Native, we need to create a file object
      const file = {
        uri: formData.thumbnail.uri,
        type: formData.thumbnail.type || "image/jpeg",
        name: formData.thumbnail.fileName || `thumbnail_${Date.now()}.jpg`,
      };

      data.append("thumbnail", file as any);

      const response = await axios.post(`${API_URL}/suggestion/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Success", "Product created successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating product:", error);
      Alert.alert("Error");
    } finally {
      setLoading(false);
    }
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
        <View style={styles.header}>
          <Text style={styles.title}>Create Product</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={formData.title}
            onChangeText={(text) => handleChange("title", text)}
            placeholderTextColor="#c4c4c4"
          />

          <TextInput
            style={styles.input}
            placeholder="Price"
            keyboardType="numeric"
            value={formData.price}
            onChangeText={(text) => handleChange("price", text)}
            placeholderTextColor="#c4c4c4"
          />

          <TextInput
            style={styles.input}
            placeholder="Type"
            value={formData.type}
            onChangeText={(text) => handleChange("type", text)}
            placeholderTextColor="#c4c4c4"
          />

          <Button
            title="Pick Thumbnail"
            onPress={handleImagePick}
            disabled={loading}
          />

          {file && (
            <View style={styles.thumbnailContainer}>
              <Text>Thumbnail: {file.fileName || "Selected Image"}</Text>
            </View>
          )}

          {loading ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : (
            <Button
              title="Create Product"
              onPress={handleSubmit}
              disabled={loading || !formData.thumbnail}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
    gap: 15,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  thumbnailContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  loader: {
    marginVertical: 20,
  },
});
