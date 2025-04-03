import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

type Item = {
  id: number;
  name: string;
  quantity: string;
  price: string;
  selectedBrand: { brand: string; img: string } | null;
};

type Brand = {
  brand: string;
  price: string;
  img: string;
};

const API_BASE_URL = "http://172.20.10.2:8081";

const Calculator = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Drinks", quantity: "", price: "", selectedBrand: null },
    { id: 2, name: "Snacks", quantity: "", price: "", selectedBrand: null },
    { id: 3, name: "Venue", quantity: "", price: "", selectedBrand: null },
    {
      id: 4,
      name: "Transportation",
      quantity: "",
      price: "",
      selectedBrand: null,
    },
    { id: 5, name: "Decoration", quantity: "", price: "", selectedBrand: null },
  ]);

  const [brandSuggestions, setBrandSuggestions] = useState<{
    [key: string]: Brand[];
  }>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchBrandSuggestions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/suggestion/list`);
        const data = response.data;

        const formattedData: { [key: string]: Brand[] } = {};
        data.forEach((item: any) => {
          if (!formattedData[item.type]) {
            formattedData[item.type] = [];
          }
          formattedData[item.type].push({
            brand: item.title,
            price: item.price,
            img: item.thumbnail,
          });
        });

        setBrandSuggestions(formattedData);
      } catch (error) {
        console.error("Error fetching brand suggestions:", error);
      }
    };

    fetchBrandSuggestions();
  }, []);

  const handleInputChange = (id: number, field: string, value: string) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(newItems);
  };

  const handleBrandSelection = (price: string, brand: string, img: string) => {
    const newItems = items.map((item, index) =>
      index === currentIndex
        ? { ...item, price, selectedBrand: { brand, img } }
        : item
    );
    setItems(newItems);
    setShowModal(false);
    setSelectedCategory(null);
  };

  const calculateTotal = () => {
    const totalAmount = items.reduce(
      (sum, item) =>
        sum + (parseFloat(item.quantity) * parseFloat(item.price) || 0),
      0
    );
    setTotal(totalAmount);
  };

  const handleAddClick = (index: number) => {
    setCurrentIndex(index);
    setSelectedCategory(items[index].name);
    setShowModal(true);
  };

  const handleDuplicateRow = (id: number) => {
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      const duplicatedItem = {
        ...items[index],
        id: Date.now(), // Ensure a unique ID using timestamp
      };

      const newItems = [
        ...items.slice(0, index + 1), // Keep items before the duplicated one
        duplicatedItem, // Insert the duplicated item
        ...items.slice(index + 1), // Keep the rest of the list
      ];

      setItems(newItems);
    }
  };

  const handleDeleteRow = (id: number) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: 30,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#e0e0e0",
        }}
      >
        Calculator
      </Text>

      {/* Brand Selection Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 20,
            paddingTop: 60,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Select a Brand for {selectedCategory}
          </Text>
          <FlatList
            data={brandSuggestions[selectedCategory ?? ""] || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                  borderWidth: 1,
                  marginVertical: 4,
                  borderRadius: 8,
                  borderColor: "#ccc",
                  backgroundColor: "#f5f5f5",
                }}
                onPress={() =>
                  handleBrandSelection(item.price, item.brand, item.img)
                }
              >
                <Image
                  source={{ uri: `${API_BASE_URL}${item.img}` }}
                  style={{ width: 50, height: 50, borderRadius: 8 }}
                />
                <Text style={{ marginLeft: 10, flex: 1 }}>{item.brand}</Text>
                <Text>{item.price} BDT</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Close" onPress={() => setShowModal(false)} />
        </View>
      </Modal>

      {/* Items Table */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View
            key={item.id}
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 12,
              padding: 10,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              backgroundColor: "#f5f5f5",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={{ flex: 2 }}>{item.name}</Text>
              <TouchableOpacity
                onPress={() => handleDuplicateRow(item.id)}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="copy" size={20} color="#4caf50" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteRow(item.id)}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="trash" size={20} color="#ff4d4f" />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", gap: 8, paddingTop: 8 }}>
              <TextInput
                style={{
                  width: 120,
                  height: 40,
                  borderColor: "#ccc",
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingLeft: 8,
                }}
                value={item.quantity}
                keyboardType="numeric"
                placeholder="Quantity"
                placeholderTextColor="#c4c4c4"
                onChangeText={(text) =>
                  handleInputChange(item.id, "quantity", text)
                }
              />
              <TextInput
                style={{
                  width: 120,
                  height: 40,
                  borderColor: "#ccc",
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingLeft: 8,
                }}
                onPress={() => handleAddClick(index)}
                value={item.price}
                keyboardType="numeric"
                placeholder="Price"
                placeholderTextColor="#c4c4c4"
                editable={false}
              />
            </View>
          </View>
        )}
      />

      {/* Total and Calculate Button */}
      <Text style={{ fontSize: 18, marginTop: 20 }}>Total: {total} BDT</Text>
      <Button title="Calculate" onPress={calculateTotal} />
    </View>
  );
};

export default Calculator;
