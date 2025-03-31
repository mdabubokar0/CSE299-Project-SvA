import React, { useEffect, useState } from "react";
import { Navbar } from "../../Navbar/Navbar";
import Title from "../../Props/Title";
import { Input, Button, Modal, List, Card, message } from "antd";
import {
  MessageOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8081/discussion";

export const Forum = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [comment, setComment] = useState("");
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    description: "",
  });

  const [comments, setComments] = useState([]); // Store comments
  const [isViewCommentsModalOpen, setViewCommentsModalOpen] = useState(false); // Show comments modal
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Edit modal state
  const [editingDiscussion, setEditingDiscussion] = useState(null); // Track discussion being edited
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, []);

  const decodeJWT = (token) => {
    if (!token) return null;
  
    // JWT is in the format: header.payload.signature
    const base64Url = token.split('.')[1]; // Extract the payload part (base64Url)
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Convert URL-safe base64 to normal base64
  
    // Decode the base64 string to JSON
    const decodedData = JSON.parse(atob(base64)); // `atob` decodes base64
    return decodedData;
  };
  
  useEffect(() => {
    fetchDiscussions();
  }, [searchQuery]); // Fetch discussions whenever searchQuery changes

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const url = searchQuery
        ? `${API_BASE_URL}/search?query=${searchQuery}`
        : API_BASE_URL;
      const res = await axios.get(url);
      setDiscussions(res.data);
    } catch (error) {
      message.error("Error fetching discussions");
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return message.warning("Comment cannot be empty!");
    try {
      await axios.post(
        `${API_BASE_URL}/${selectedDiscussion.id}/comment`,
        { comment },
        { headers: getAuthHeaders() }
      );
      message.success("Comment added!");
      setComment("");
      setCommentModalOpen(false);
      fetchDiscussions();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  const handleCreateDiscussion = async () => {
    const { title, description } = newDiscussion;
    if (!title.trim() || !description.trim())
      return message.warning("All fields are required!");
    try {
      await axios.post(`${API_BASE_URL}/create`, newDiscussion, {
        headers: getAuthHeaders(),
      });
      message.success("Discussion created!");
      setCreateModalOpen(false);
      setNewDiscussion({ title: "", description: "" });
      fetchDiscussions();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to create discussion"
      );
    }
  };

  const handleViewComments = async (discussion) => {
    setSelectedDiscussion(discussion);
    setViewCommentsModalOpen(true);

    try {
      const res = await axios.get(`${API_BASE_URL}/${discussion.id}/comments`);
      setComments(res.data); // Set the comments for the selected discussion
    } catch (error) {
      message.error("Failed to fetch comments");
    }
  };

  // Open edit modal
  const handleEditClick = (discussion) => {
    setEditingDiscussion(discussion);
    setEditModalOpen(true);
  };

  // Handle edit submission
  const handleEditDiscussion = async () => {
    if (
      !editingDiscussion.title.trim() ||
      !editingDiscussion.description.trim()
    ) {
      return message.warning("Title and description cannot be empty!");
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

      message.success("Discussion updated successfully!");
      setEditModalOpen(false);
      fetchDiscussions();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update discussion"
      );
    }
  };

  // Delete discussion
  const handleDeleteDiscussion = async (discussionId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this discussion?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/${discussionId}`, {
            headers: getAuthHeaders(),
          });

          message.success("Discussion deleted successfully!");
          fetchDiscussions();
        } catch (error) {
          message.error(
            error.response?.data?.message || "Failed to delete discussion"
          );
        }
      },
    });
  };

  return (
    <div>
      <Navbar />
      <div>
        <Title
          title="FORUM"
          subtitle="Share your thoughts with the community."
        />
        <div className="w-[800px] m-auto">
          <div className="flex items-center gap-1 mt-10">
            <Input
              placeholder="Search discussions..."
              className="h-[48px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery instantly
            />
            <Button
              type="primary"
              className="h-[48px] bg-primary"
              onClick={() => setCreateModalOpen(true)}
            >
              Ask Question
            </Button>
          </div>

          {/* List of discussions */}
          <List
            loading={loading}
            dataSource={discussions}
            renderItem={(discussion) => (
              <Card className="mt-4" key={discussion.id}>
                <h3 className="text-lg font-semibold">{discussion.title}</h3>
                <p>{discussion.description}</p>
                <p className="text-sm text-gray-500">
                  By: {discussion.username}
                </p>

                <div className="flex items-center gap-4 mt-2">
                  <Button
                    type="link"
                    onClick={() => {
                      setSelectedDiscussion(discussion);
                      setCommentModalOpen(true);
                    }}
                  >
                    Answer
                  </Button>

                  {/* View Comments */}
                  <MessageOutlined
                    className="cursor-pointer text-lg text-blue-600"
                    onClick={() => handleViewComments(discussion)}
                  />

                  {/* Edit Discussion */}
                  <EditOutlined
                    className="cursor-pointer text-lg text-green-600"
                    onClick={() => handleEditClick(discussion)}
                  />

                  {/* Delete Discussion */}
                  <DeleteOutlined
                    className="cursor-pointer text-lg text-red-600"
                    onClick={() => handleDeleteDiscussion(discussion.id)}
                  />
                </div>
              </Card>
            )}
          />
        </div>
      </div>

      {/* Create Discussion Modal */}
      <Modal
        title="Create Discussion"
        open={isCreateModalOpen}
        onCancel={() => setCreateModalOpen(false)} // This will close the modal when clicked
        onOk={handleCreateDiscussion} // Submit the form when the "Ok" button is clicked
      >
        <Input
          placeholder="Title"
          value={newDiscussion.title}
          onChange={(e) =>
            setNewDiscussion({ ...newDiscussion, title: e.target.value })
          }
        />
        <Input.TextArea
          rows={4}
          placeholder="Description"
          className="mt-2"
          value={newDiscussion.description}
          onChange={(e) =>
            setNewDiscussion({ ...newDiscussion, description: e.target.value })
          }
        />
      </Modal>

      {/* Comment Modal */}
      <Modal
        title="Add Comment"
        open={isCommentModalOpen}
        onCancel={() => setCommentModalOpen(false)}
        onOk={handleCommentSubmit}
      >
        <Input.TextArea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
        />
      </Modal>

      {/* View Comments Modal */}
      <Modal
        title="Answers"
        open={isViewCommentsModalOpen}
        onCancel={() => setViewCommentsModalOpen(false)}
        footer={null} // Remove the footer buttons
      >
        <List
          dataSource={comments}
          renderItem={(comment) => (
            <List.Item>
              <p>{comment.comment}</p>
              <p className="text-sm text-gray-500">
                By: <strong>{comment.username}</strong> on{" "}
                {new Date(comment.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </List.Item>
          )}
        />
      </Modal>

      {/* Edit Discussion Modal */}
      <Modal
        title="Edit Discussion"
        open={isEditModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleEditDiscussion}
      >
        <Input
          placeholder="Title"
          value={editingDiscussion?.title}
          onChange={(e) =>
            setEditingDiscussion({
              ...editingDiscussion,
              title: e.target.value,
            })
          }
        />
        <Input.TextArea
          rows={4}
          placeholder="Description"
          className="mt-2"
          value={editingDiscussion?.description}
          onChange={(e) =>
            setEditingDiscussion({
              ...editingDiscussion,
              description: e.target.value,
            })
          }
        />
      </Modal>
    </div>
  );
};
