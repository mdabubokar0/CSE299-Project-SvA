import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { Appbar, Card, Button, IconButton } from "react-native-paper";
import axios from "axios";
import { API_URL } from "@/context/api";

// Types
interface Comment {
  id: number;
  comment: string;
  username: string;
  created_at: string;
}

interface Discussion {
  id: number;
  title: string;
  description: string;
  username: string;
  comments?: Comment[];
}

const API_BASE_URL = `${API_URL}/discussion`;

const Forum: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [comment, setComment] = useState("");
  const [selectedDiscussion, setSelectedDiscussion] =
    useState<Discussion | null>(null);
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    description: "",
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const [isViewCommentsModalOpen, setViewCommentsModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingDiscussion, setEditingDiscussion] = useState<Discussion | null>(
    null
  );

  const decodeJWT = (token: string | null) => {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedData = JSON.parse(atob(base64));
    return decodedData;
  };

  useEffect(() => {
    fetchDiscussions();
  }, [searchQuery]);

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const url = searchQuery
        ? `${API_BASE_URL}/search?query=${searchQuery}`
        : API_BASE_URL;
      const res = await axios.get(url);
      setDiscussions(res.data);
    } catch (error) {
      Alert.alert("Error", "Error fetching discussions");
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert("Warning", "Comment cannot be empty!");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/${selectedDiscussion?.id}/comment`,
        { comment },
        { headers: getAuthHeaders() }
      );
      Alert.alert("Success", "Comment added!");
      setComment("");
      setCommentModalOpen(false);
      fetchDiscussions();
    } catch (error) {
      Alert.alert("Error", "Failed to add comment");
    }
  };

  const handleCreateDiscussion = async () => {
    const { title, description } = newDiscussion;
    if (!title.trim() || !description.trim()) {
      Alert.alert("Warning", "All fields are required!");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/create`, newDiscussion, {
        headers: getAuthHeaders(),
      });
      Alert.alert("Success", "Discussion created!");
      setCreateModalOpen(false);
      setNewDiscussion({ title: "", description: "" });
      fetchDiscussions();
    } catch (error) {
      Alert.alert("Error", "Failed to create discussion");
    }
  };

  const handleViewComments = async (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
    setViewCommentsModalOpen(true);

    try {
      const res = await axios.get(`${API_BASE_URL}/${discussion.id}/comments`);
      console.log("Comments response:", res.data);

      if (Array.isArray(res.data)) {
        setComments(res.data);
      } else {
        setComments([]); // fallback
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch comments");
    }
  };

  const handleEditClick = (discussion: Discussion) => {
    setEditingDiscussion(discussion);
    setEditModalOpen(true);
  };

  const handleEditDiscussion = async () => {
    if (
      !editingDiscussion?.title.trim() ||
      !editingDiscussion?.description.trim()
    ) {
      Alert.alert("Warning", "Title and description cannot be empty!");
      return;
    }

    try {
      await axios.patch(
        `${API_BASE_URL}/${editingDiscussion.id}`,
        {
          title: editingDiscussion.title,
          description: editingDiscussion.description,
        },
        { headers: getAuthHeaders() }
      );

      Alert.alert("Success", "Discussion updated successfully!");
      setEditModalOpen(false);
      fetchDiscussions();
    } catch (error) {
      Alert.alert("Error", "Failed to update discussion");
    }
  };

  const handleDeleteDiscussion = (discussionId: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this discussion?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE_URL}/${discussionId}`, {
                headers: getAuthHeaders(),
              });
              Alert.alert("Success", "Discussion deleted successfully!");
              fetchDiscussions();
            } catch (error) {
              Alert.alert("Error", "Failed to delete discussion");
            }
          },
        },
      ]
    );
  };

  const renderDiscussionItem = ({ item }: { item: Discussion }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text style={styles.username}>By: {item.username}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          textColor="#010101"
          onPress={() => {
            setSelectedDiscussion(item);
            setCommentModalOpen(true);
          }}
        >
          Answer
        </Button>
        <IconButton
          icon="message"
          iconColor="#010101"
          onPress={() => handleViewComments(item)}
        />
        <IconButton
          icon="pencil"
          iconColor="#010101"
          onPress={() => handleEditClick(item)}
        />
        <IconButton
          icon="delete"
          iconColor="#010101"
          onPress={() => handleDeleteDiscussion(item.id)}
        />
      </Card.Actions>
    </Card>
  );

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Text>{item.comment}</Text>
      <Text style={styles.commentMeta}>
        By: <Text style={styles.commentUser}>{item.username}</Text> on{" "}
        {new Date(item.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Forum</Text>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search discussions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Button
            mode="contained"
            style={styles.createButton}
            onPress={() => setCreateModalOpen(true)}
          >
            Ask
          </Button>
        </View>

        <FlatList
          data={discussions}
          renderItem={renderDiscussionItem}
          keyExtractor={(item) => item.id.toString()}
          refreshing={loading}
          onRefresh={fetchDiscussions}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Create Discussion Modal */}
      <Modal
        visible={isCreateModalOpen}
        animationType="slide"
        onRequestClose={() => setCreateModalOpen(false)}
      >
        <View style={styles.modalContainer}>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => setCreateModalOpen(false)} />
            <Appbar.Content title="Create Discussion" />
          </Appbar.Header>
          <ScrollView style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newDiscussion.title}
              onChangeText={(text) =>
                setNewDiscussion({ ...newDiscussion, title: text })
              }
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              multiline
              numberOfLines={4}
              value={newDiscussion.description}
              onChangeText={(text) =>
                setNewDiscussion({ ...newDiscussion, description: text })
              }
            />
            <Button
              mode="contained"
              style={styles.submitButton}
              onPress={handleCreateDiscussion}
            >
              Create
            </Button>
          </ScrollView>
        </View>
      </Modal>

      {/* Comment Modal */}
      <Modal
        visible={isCommentModalOpen}
        animationType="slide"
        onRequestClose={() => setCommentModalOpen(false)}
      >
        <View style={styles.modalContainer}>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => setCommentModalOpen(false)} />
            <Appbar.Content title="Add Comment" />
          </Appbar.Header>
          <ScrollView style={styles.modalContent}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write a comment..."
              multiline
              numberOfLines={3}
              value={comment}
              onChangeText={setComment}
            />
            <Button
              mode="contained"
              style={styles.submitButton}
              onPress={handleCommentSubmit}
            >
              Submit
            </Button>
          </ScrollView>
        </View>
      </Modal>

      {/* View Comments Modal */}
      <Modal
        visible={isViewCommentsModalOpen}
        animationType="slide"
        onRequestClose={() => setViewCommentsModalOpen(false)}
      >
        <View style={styles.modalContainer}>
          <Appbar.Header>
            <Appbar.BackAction
              onPress={() => setViewCommentsModalOpen(false)}
            />
            <Appbar.Content title="Answers" />
          </Appbar.Header>
          <FlatList
            data={Array.isArray(comments) ? comments.filter(Boolean) : []}
            renderItem={renderCommentItem}
            keyExtractor={(item, index) => {
              // If `item.id` is valid, use it. Otherwise, fallback to index
              if (item?.id != null) return item.id.toString();
              console.warn("Invalid comment item (no id):", item);
              return index.toString();
            }}
            contentContainerStyle={styles.commentsList}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No answers found
              </Text>
            }
          />
        </View>
      </Modal>

      {/* Edit Discussion Modal */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        onRequestClose={() => setEditModalOpen(false)}
      >
        <View style={styles.modalContainer}>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => setEditModalOpen(false)} />
            <Appbar.Content title="Edit Discussion" />
          </Appbar.Header>
          <ScrollView style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={editingDiscussion?.title || ""}
              onChangeText={(text) =>
                editingDiscussion &&
                setEditingDiscussion({ ...editingDiscussion, title: text })
              }
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              multiline
              numberOfLines={4}
              value={editingDiscussion?.description || ""}
              onChangeText={(text) =>
                editingDiscussion &&
                setEditingDiscussion({
                  ...editingDiscussion,
                  description: text,
                })
              }
            />
            <Button
              mode="contained"
              style={styles.submitButton}
              onPress={handleEditDiscussion}
            >
              Update
            </Button>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
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
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 4,
    marginRight: 8,
  },
  createButton: {
    borderRadius: 4,
    backgroundColor: "#010101",
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  username: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalContent: {
    padding: 16,
  },
  input: {
    backgroundColor: "white",
    marginBottom: 16,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: "#010101",
  },
  commentsList: {
    padding: 16,
  },
  commentItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  commentMeta: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  commentUser: {
    fontWeight: "bold",
  },
});

export default Forum;
