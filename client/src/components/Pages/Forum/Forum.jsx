import React, { useEffect, useState } from "react";
import { Navbar } from "../../Navbar/Navbar";
import Title from "../../Props/Title";
import { Input, Button, Modal, List, Card, message } from "antd";
import { MessageOutlined } from "@ant-design/icons"; // Import comment icon
import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/discussions";

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

  useEffect(() => {
    fetchDiscussions();
  }, []);

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

  const handleSearch = async () => {
    fetchDiscussions();
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
      setComments(res.data);
    } catch (error) {
      message.error("Failed to fetch comments");
    }
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="primary"
              className="h-[48px] bg-primary"
              onClick={handleSearch}
            >
              Search
            </Button>
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
                  Posted by: {discussion.username}
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

                  {/* Icon to view comments */}
                  <MessageOutlined
                    className="cursor-pointer text-lg text-blue-600"
                    onClick={() => handleViewComments(discussion)}
                  />
                </div>
              </Card>
            )}
          />
        </div>
      </div>

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

      {/* Create Discussion Modal */}
      <Modal
        title="Create New Discussion"
        open={isCreateModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={handleCreateDiscussion}
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

      {/* View Comments Modal */}
      <Modal
        title="Answers"
        open={isViewCommentsModalOpen}
        onCancel={() => setViewCommentsModalOpen(false)}
        footer={null}
      >
        <List
          dataSource={comments}
          renderItem={(comment) => (
            <Card className="mb-2">
              <p>
                <strong>{comment.username}</strong>: {comment.comment}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </Card>
          )}
        />
      </Modal>
    </div>
  );
};
