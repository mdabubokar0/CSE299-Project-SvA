import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import {
  Button,
  TextInput,
  Dialog,
  Portal,
  Provider,
} from "react-native-paper";
import { StyleSheet } from "react-native";
import { API_URL } from "@/context/api";
import { Ionicons } from "@expo/vector-icons";

type Suggestion = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  type: string;
};

interface Props {
  productType: string;
}

export const Products: React.FC<Props> = ({ productType }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSuggestion, setEditingSuggestion] = useState<Suggestion | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [type, setType] = useState("");

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/suggestion/paginated-list`, {
        params: { page: 1, limit: 100 },
      });

      const filtered =
        productType === "All"
          ? response.data.suggestions
          : response.data.suggestions.filter(
              (s: Suggestion) => s.type === productType
            );

      setSuggestions(filtered);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      Alert.alert("Error", "Failed to fetch suggestions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [productType]);

  const handleDelete = async (id: number) => {
    Alert.alert("Confirm", "Are you sure you want to delete this?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/suggestion/delete/${id}`);
            fetchSuggestions();
            Alert.alert("Deleted", "Suggestion deleted successfully!");
          } catch (err) {
            console.error("Delete failed", err);
            Alert.alert("Error", "Failed to delete suggestion");
          }
        },
      },
    ]);
  };

  const handleEditSubmit = async () => {
    if (!editingSuggestion) return;

    if (!title || !price || !thumbnail || !type) {
      Alert.alert("Validation", "All fields are required.");
      return;
    }

    try {
      const response = await axios.patch(
        `${API_URL}/suggestion/edit/${editingSuggestion.id}`,
        {
          title,
          price: parseFloat(price),
          thumbnail,
          type,
        }
      );

      if (response.data) {
        Alert.alert("Success", "Suggestion updated successfully!");
        fetchSuggestions();
        setIsModalVisible(false);
        setEditingSuggestion(null);
      }
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Error", "Failed to update suggestion");
    }
  };

  const renderItem = ({ item }: { item: Suggestion }) => (
    <View style={styles.item}>
      <Image
        source={{
          uri: item.thumbnail.startsWith("http")
            ? item.thumbnail
            : `${API_URL}${item.thumbnail}`,
        }}
        style={styles.thumbnail}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>৳{Number(item.price).toFixed(2)}</Text>
        <Text style={styles.type}>{item.type}</Text>
      </View>
      <TouchableOpacity
        style={{ marginRight: 12 }}
        onPress={() => {
          setEditingSuggestion(item);
          setTitle(item.title);
          setPrice(item.price.toString());
          setThumbnail(item.thumbnail);
          setType(item.type);
          setIsModalVisible(true);
        }}
      >
        <Ionicons name="pencil" size={24} color="#2196F3" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash" size={24} color="#f44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.header}>{productType}s</Text>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        )}

        <Portal>
          <Dialog
            visible={isModalVisible}
            onDismiss={() => setIsModalVisible(false)}
          >
            <Dialog.Title>Edit Product</Dialog.Title>
            <Dialog.Content>
              <TextInput label="Title" value={title} onChangeText={setTitle} />
              <TextInput
                label="Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
              <TextInput
                label="Thumbnail URL"
                value={thumbnail}
                onChangeText={setThumbnail}
              />
              <TextInput label="Type" value={type} onChangeText={setType} />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setIsModalVisible(false)}>Cancel</Button>
              <Button onPress={handleEditSubmit}>Save</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  item: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderWidth: 1,
    borderColor: "#c4c4c4",
    borderRadius: 10,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 10,
  },
  title: {
    fontWeight: "bold",
  },
  price: {
    color: "#555",
  },
  type: {
    fontStyle: "italic",
  },
  edit: {
    color: "#007bff",
    marginLeft: 10,
  },
  delete: {
    color: "red",
    marginLeft: 10,
  },
});
