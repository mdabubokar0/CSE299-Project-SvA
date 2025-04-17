import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { API_URL } from "@/context/api";
import { useAuth } from "@/context/AuthContext";

interface Event {
  id: string;
  title: string;
  description?: string;
  venue: string;
  date: string;
  capacity: number;
  ticket: number;
  thumbnail: string;
  category?: string;
}

interface Props {
  eventType: string;
}

export const Events: React.FC<Props> = ({ eventType }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({});
  const { user } = useAuth();
  const token = user?.token || ""; // A fallback empty string or handle the null case
  const role = user?.role || ""; // A fallback empty string or handle the null case

  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token, pagination.current, pagination.pageSize, eventType]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/event/paginated-list`, {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data.events)) {
        const filteredEvents =
          eventType === "All"
            ? response.data.events
            : response.data.events.filter(
                (event: Event) => event.category === eventType
              );

        setEvents(filteredEvents);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || filteredEvents.length,
        }));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      Alert.alert("Error", "Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchEvents();
  };

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      venue: event.venue,
      date: event.date,
      capacity: event.capacity,
      ticket: event.ticket,
    });
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    if (!editingEvent) return;

    try {
      const response = await axios.patch(
        `${API_URL}/event/edit/${editingEvent.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        Alert.alert("Success", "Event updated successfully!");
        fetchEvents();
        setIsEditModalVisible(false);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      Alert.alert("Error", "Failed to update event");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this event?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              await axios.delete(`${API_URL}/event/delete/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              fetchEvents();
              Alert.alert("Success", "Event deleted successfully!");
            },
            style: "destructive",
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting event:", error);
      Alert.alert("Error", "Failed to delete event");
    }
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <View style={styles.eventCard}>
      {item.thumbnail && (
        <Image
          source={{
            uri: item.thumbnail.startsWith("http")
              ? item.thumbnail
              : `${API_URL}${item.thumbnail}`,
          }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      )}
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.eventDescription}>{item.description}</Text>
        )}
        <Text style={styles.eventInfo}>Venue: {item.venue}</Text>
        <Text style={styles.eventInfo}>
          Date: {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text style={styles.eventInfo}>Capacity: {item.capacity}</Text>
        <Text style={styles.eventInfo}>Ticket Price: ৳{item.ticket}</Text>
        {item.category && (
          <Text style={styles.eventInfo}>Category: {item.category}</Text>
        )}
      </View>
      {role && role === "organizer" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => handleEditClick(item)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading && events.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{eventType}s</Text>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events found</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
            >
              <Text style={styles.refreshButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Event</Text>

            <TextInput
              placeholder="Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              style={styles.input}
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Description"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              style={[styles.input, styles.multilineInput]}
              multiline
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Venue"
              value={formData.venue}
              onChangeText={(text) => setFormData({ ...formData, venue: text })}
              style={styles.input}
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Date (YYYY-MM-DD)"
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
              style={styles.input}
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Capacity"
              value={formData.capacity?.toString() || ""}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  capacity: text ? parseInt(text) : undefined,
                })
              }
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Ticket Price"
              value={formData.ticket?.toString() || ""}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  ticket: text ? parseInt(text) : undefined,
                })
              }
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleEditSubmit}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
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
  listContainer: {
    flexGrow: 1,
  },
  eventCard: {
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: "100%",
    height: 200,
  },
  eventDetails: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  eventInfo: {
    fontSize: 14,
    marginBottom: 3,
    color: "#444",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#9E9E9E",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  refreshButton: {
    padding: 10,
    backgroundColor: "#6200ee",
    borderRadius: 5,
  },
  refreshButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
