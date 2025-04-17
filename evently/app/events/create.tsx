import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Platform,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import { API_URL } from "@/context/api";
import { Stack } from "expo-router";

const Create = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [capacity, setCapacity] = useState<string>("");
  const [ticket, setTicket] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: "photo" });

    if (result.assets && result.assets.length > 0) {
      setThumbnail(result.assets[0]);
    }
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      !venue ||
      !capacity ||
      !ticket ||
      !category ||
      !thumbnail
    ) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("venue", venue);
    formData.append("date", date.toISOString().split("T")[0]);
    formData.append("capacity", capacity);
    formData.append("ticket", ticket);
    formData.append("category", category);
    formData.append("thumbnail", {
      uri: thumbnail.uri,
      type: thumbnail.type,
      name: thumbnail.fileName,
    } as any); // Blob with casting

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/event/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Success", "Event created successfully!");
      console.log("Event Created:", response.data);
    } catch (error) {
      Alert.alert("Error", "Something went wrong while creating the event.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerBackTitle: "Back",
          headerTintColor: "#000",
        }}
      />
      <Text style={styles.header}>Create Event</Text>
      <ScrollView>
        <Text style={styles.label}>Event Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter event title"
          placeholderTextColor="#c4c4c4"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter event description"
          multiline
          placeholderTextColor="#c4c4c4"
        />

        <Text style={styles.label}>Venue</Text>
        <TextInput
          style={styles.input}
          value={venue}
          onChangeText={setVenue}
          placeholder="Venue"
          placeholderTextColor="#c4c4c4"
        />

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePicker}
        >
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Capacity</Text>
        <TextInput
          style={styles.input}
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="numeric"
          placeholder="Enter capacity"
          placeholderTextColor="#c4c4c4"
        />

        <Text style={styles.label}>Ticket Price</Text>
        <TextInput
          style={styles.input}
          value={ticket}
          onChangeText={setTicket}
          keyboardType="numeric"
          placeholder="Enter ticket price"
          placeholderTextColor="#c4c4c4"
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          keyboardType="numeric"
          placeholder="Enter category"
          placeholderTextColor="#c4c4c4"
        />

        <Text style={styles.label}>Event Thumbnail</Text>
        <Button title="Upload Image" onPress={handleImagePick} />
        {thumbnail && (
          <Image
            source={{ uri: thumbnail.uri }}
            style={styles.thumbnailPreview}
          />
        )}

        <View style={styles.submitButton}>
          <Button
            title={loading ? "Creating..." : "Create Event"}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 12,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
  textArea: {
    height: 80,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
  },
  datePicker: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  thumbnailPreview: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 6,
  },
  submitButton: {
    marginTop: 20,
  },
});
