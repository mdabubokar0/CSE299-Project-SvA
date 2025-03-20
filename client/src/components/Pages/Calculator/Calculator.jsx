import React, { useState, useEffect } from "react";
import { Navbar } from "../../Navbar/Navbar";
import Title from "../../Props/Title";
import { Button, Modal, Input, Table, Dropdown, Menu } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Calculator = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, []);

  // State for items with unique IDs
  const [items, setItems] = useState([
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

  // State for brand suggestions fetched from the backend
  const [brandSuggestions, setBrandSuggestions] = useState({});

  // State for selected category, total, modal visibility, and current index
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Fetch brand suggestions from the backend when the component mounts
  useEffect(() => {
    const fetchBrandSuggestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/suggestion/list"
        ); // Replace with your backend API endpoint
        const data = response.data;

        // Transform the backend data into the format expected by the component
        const formattedData = {};
        data.forEach((item) => {
          if (!formattedData[item.type]) {
            formattedData[item.type] = [];
          }
          formattedData[item.type].push({
            brand: item.title,
            price: item.price,
            img: item.thumbnail, // Assuming the backend provides an image URL
          });
        });

        setBrandSuggestions(formattedData);
      } catch (error) {
        console.error("Error fetching brand suggestions:", error);
      }
    };

    fetchBrandSuggestions();
  }, []);

  // Handle input changes for quantity
  const handleInputChange = (id, field, value) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(newItems);
  };

  // Handle brand selection
  const handleBrandSelection = (price, brand, img) => {
    const newItems = items.map((item, index) =>
      index === currentIndex
        ? { ...item, price: price, selectedBrand: { brand, img } }
        : item
    );
    setItems(newItems);
    setShowModal(false);
    setSelectedCategory(null);
  };

  // Calculate the total cost
  const calculateTotal = () => {
    const totalAmount = items.reduce(
      (sum, item) =>
        sum + (parseFloat(item.quantity) * parseFloat(item.price) || 0),
      0
    );
    setTotal(totalAmount);
  };

  // Add a new row under the same category
  const handleAddRow = (category) => {
    const newItem = {
      id: items.length + 1, // Generate a unique ID for the new row
      name: category,
      quantity: "",
      price: "",
      selectedBrand: null,
    };
    // Find the index of the last item in the same category
    const lastIndex = items.findLastIndex((item) => item.name === category);
    // Insert the new row right after the last item of the same category
    const newItems = [
      ...items.slice(0, lastIndex + 1),
      newItem,
      ...items.slice(lastIndex + 1),
    ];
    setItems(newItems);
  };

  // Delete a specific row
  const handleDeleteRow = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };

  // Open the modal for brand selection
  const handleAddClick = (index) => {
    setCurrentIndex(index);
    setSelectedCategory(items[index].name);
    setShowModal(true);
  };

  // Dropdown menu for adding rows
  const addRowMenu = (
    <Menu>
      {Object.keys(brandSuggestions).map((category) => (
        <Menu.Item key={category} onClick={() => handleAddRow(category)}>
          Add {category}
        </Menu.Item>
      ))}
    </Menu>
  );

  // Columns for the Ant Design Table
  const columns = [
    {
      title: (
        <Dropdown overlay={addRowMenu} trigger={["click"]}>
          <Button type="primary" icon={<PlusOutlined />}>
            Product
          </Button>
        </Dropdown>
      ),
      dataIndex: "name",
      key: "name",
      align: "center", // Center-align header text
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center", // Center-align header text
      render: (text, record) => (
        <Input
          type="number"
          value={text}
          onChange={(e) =>
            handleInputChange(record.id, "quantity", e.target.value)
          }
          style={{ backgroundColor: "#f0f2f5", width: "100%" }}
        />
      ),
    },
    {
      title: "Price (BDT)",
      dataIndex: "price",
      key: "price",
      align: "center", // Center-align header text
      render: (text) => (
        <Input
          type="number"
          value={text}
          readOnly
          style={{ backgroundColor: "#f0f2f5" }}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center", // Center-align header text
      render: (text, record, index) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          {record.selectedBrand ? (
            <div
              className="flex flex-col items-center"
              onClick={() => handleAddClick(index)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`http://localhost:8081${record.selectedBrand.img}`}
                alt={record.selectedBrand.brand}
                style={{ width: "30px", height: "30px" }}
              />
            </div>
          ) : (
            <Button
              icon={<PlusOutlined />}
              onClick={() => handleAddClick(index)}
              style={{ backgroundColor: "#1890ff", color: "white" }}
            />
          )}
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRow(record.id)}
            style={{ backgroundColor: "#ff4d4f", color: "white" }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="p-4 flex flex-col items-center">
        <Title title="Calculator" subtitle="Calculate your event expenses" />

        {/* Modal for Brand Suggestions */}
        <Modal
          title={`Select a Brand for ${selectedCategory}`}
          visible={showModal}
          onCancel={() => setShowModal(false)}
          footer={null}
          width={600}
          bodyStyle={{ height: "400px", overflowY: "scroll" }}
        >
          <div className="grid grid-cols-4 gap-4 overflow-y-auto">
            {brandSuggestions[selectedCategory] &&
              brandSuggestions[selectedCategory].map((brand, index) => (
                <div
                  key={index}
                  className="p-4 cursor-pointer hover:bg-secondary-100 flex flex-col items-center border-2 border-gray-500 rounded-lg shadow-md transform transition duration-300"
                  onClick={() =>
                    handleBrandSelection(brand.price, brand.brand, brand.img)
                  }
                  style={{
                    height: "200px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <img
                    src={`http://localhost:8081${brand.img}`}
                    alt={brand.brand}
                    className="w-24 h-24 object-cover rounded-lg shadow-lg"
                  />
                  <p className="mt-2 font-semibold text-lg">{brand.brand}</p>
                  <p className="text-sm text-gray-300">{brand.price} tk</p>
                </div>
              ))}
          </div>
        </Modal>

        {/* Ant Design Table */}
        <div className="text-primary p-4 rounded-lg w-[800px] mt-5">
          <Table
            columns={columns}
            dataSource={items}
            rowKey="id"
            pagination={false}
            bordered
          />
          <div className="text-xl font-semibold mt-2">Total: {total} BDT</div>
          <Button className="mt-4 w-full" onClick={calculateTotal}>
            Calculate
          </Button>
        </div>
      </div>
    </div>
  );
};
