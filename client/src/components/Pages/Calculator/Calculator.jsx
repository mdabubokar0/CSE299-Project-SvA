import React, { useState } from "react";
import { Navbar } from "../../Navbar/Navbar";
import Title from "../../Props/Title";
import { Button, Modal, Input, Table } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";

export const Calculator = () => {
  const [items, setItems] = useState([
    { name: "Drinks", quantity: "", price: "", selectedBrand: null },
    { name: "Snacks", quantity: "", price: "", selectedBrand: null },
    { name: "Venue Cost", quantity: "", price: "", selectedBrand: null },
    { name: "Transportation", quantity: "", price: "", selectedBrand: null },
    { name: "Decoration", quantity: "", price: "", selectedBrand: null },
  ]);

  const brandSuggestions = {
    Drinks: [
      { brand: "Aquafina", price: 20, img: "/img/aquafina.png" },
      { brand: "Kinley", price: 20, img: "/img/kinley.png" },
      { brand: "Mum", price: 15, img: "/img/mum.png" },
      { brand: "Fresh", price: 120, img: "/img/fresh.png" },
      { brand: "Fruitika", price: 30, img: "/img/fruitika.png" },
      { brand: "Drinko", price: 30, img: "/img/drinko.png" },
      { brand: "Bruvana", price: 35, img: "/img/bruvana.png" },
      { brand: "Colacola", price: 25, img: "/img/colacola.png" },
      { brand: "Fanta", price: 65, img: "/img/fanta.png" },
    ],
    Snacks: [
      { brand: "Muffin", price: 10, img: "/img/muffin.png" },
      { brand: "Kurkure", price: 20, img: "/img/kurkure.png" },
      { brand: "Detos", price: 25, img: "/img/detos.png" },
      { brand: "Chocolate", price: 20, img: "/img/chocolate_bar.png" },
    ],
    "Venue Cost": [
      { brand: "Dhaka Regency", price: 10000, img: "/img/regency.png" },
      { brand: "Pan Pacific", price: 12000, img: "/img/pan_pacific.jpg" },
      { brand: "Radisson", price: 15000, img: "/img/radison.jpg" },
      { brand: "Westin", price: 20000, img: "/img/westin.jpg" },
    ],
    Transportation: [
      { brand: "Bus", price: 8000, img: "/img/bus_pic.png" },
      { brand: "Car", price: 3000, img: "/img/premio.jpg" },
      { brand: "Bike", price: 500, img: "/img/bike.jpg" },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const handleInputChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleBrandSelection = (price, brand, img) => {
    const newItems = [...items];
    newItems[currentIndex].price = price;
    newItems[currentIndex].selectedBrand = { brand, img }; // Store the selected brand
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

  const handleAddClick = (index) => {
    setCurrentIndex(index);
    setSelectedCategory(items[index].name);
    setShowModal(true);
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
          style={{ backgroundColor: "#f0f2f5", width: "100%" }}
        />
      ),
    },
    {
      title: "Price (BDT)",
      dataIndex: "price",
      key: "price",
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
      title: "Brand",
      key: "brand",
      render: (text, record, index) => (
        <div>
          {record.selectedBrand ? (
            <div
              className="flex flex-col items-center"
              onClick={() => handleAddClick(index)} // Allow brand change when clicked
              style={{ cursor: "pointer" }}
            >
              <img
                src={record.selectedBrand.img}
                alt={record.selectedBrand.brand}
                style={{ width: "30px", height: "30px" }}
              />
              <span>{record.selectedBrand.brand}</span>
            </div>
          ) : (
            <Button
              icon={<PlusOutlined />}
              onClick={() => handleAddClick(index)}
              style={{ backgroundColor: "#1890ff", color: "white" }}
            >
              Add
            </Button>
          )}
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
          bodyStyle={{ height: "400px", overflowY: "scroll" }} // Allow scrolling vertically
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
                    src={brand.img}
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
            rowKey="name"
            pagination={false}
            bordered
          />
          <Button className="mt-4 w-full" onClick={calculateTotal}>
            Calculate
          </Button>
          <div className="text-xl font-semibold mt-2">Total: {total} BDT</div>
        </div>
      </div>
    </div>
  );
};
