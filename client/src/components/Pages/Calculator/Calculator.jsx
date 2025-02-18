
import React, { useState } from "react";
import { Navbar } from "../../Navbar/Navbar";

export const Calculator = () => {
  const [items, setItems] = useState([
    { name: "Water", quantity: "", price: "" },
    { name: "Juice & Drinks", quantity: "", price: "" },
    { name: "Snacks", quantity: "", price: "" },
    { name: "Venue Cost", quantity: "", price: "" },
    { name: "Transportation", quantity: "", price: "" },
    { name: "Decoration", quantity: "", price: "" },
  ]);

  const brandSuggestions = {
    "Water": [
      { brand: "Aquafina", price: 20, img: "/img/aquafina.png" },
      { brand: "Kinley", price: 20, img: "/img/kinley.png" },
      { brand: "Mum", price: 15, img: "/img/mum.png" },
      { brand: "Fresh", price: 120, img: "/img/fresh.png" },
    ],
    "Juice & Drinks": [
      { brand: "Fruitika", price: 30, img: "/img/fruitika.png" },
      { brand: "Drinko", price: 30, img: "/img/drinko.png" },
      { brand: "Bruvana", price: 35, img: "/img/bruvana.png" },
      { brand: "Colacola", price: 25, img: "/img/colacola.png" },
      { brand: "Fanta", price: 65, img: "/img/fanta.png" },
    ],
    "Snacks": [
      { brand: "Muffin", price: 10, img: "/img/muffin.png" },
      { brand: "Kurkure", price: 20, img: "/img/kurkure.png" },
      { brand: "Detos", price: 25, img: "/img/detos.png" },
      { brand: "Chocolate_bar", price: 20, img: "/img/chocolate_bar.png" },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [total, setTotal] = useState(0);

  const handleInputChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBrandSelection = (index, price) => {
    const newItems = [...items];
    newItems[index].price = price;
    setItems(newItems);
    setSelectedCategory(null);
  };

  const calculateTotal = () => {
    const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.price) || 0), 0);
    setTotal(totalAmount);
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gray-900 min-h-screen p-4 text-gray-100 flex flex-col items-center">
        <div className="bg-green-300 text-black text-center py-4 rounded-xl text-2xl font-bold w-full max-w-4xl">
          Budget Calculator
        </div>
        
        {/* Horizontal Categories */}
        <div className="flex justify-center gap-4 mt-6 w-full max-w-4xl overflow-x-auto p-2">
          {items.map((item, index) => (
            <button
              key={index}
              className="bg-green-200 text-black py-2 px-4 rounded-lg text-lg"
              onClick={() => handleCategoryClick(item.name)}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Horizontal Brand Suggestions */}
        {selectedCategory && brandSuggestions[selectedCategory] && (
          <div className="bg-gray-800 p-4 rounded-lg mt-4 text-white shadow-lg w-full max-w-4xl overflow-x-auto flex gap-4">
            {brandSuggestions[selectedCategory].map((brand, index) => (
              <div
                key={index}
                className="p-4 cursor-pointer hover:bg-gray-700 flex flex-col items-center border-2 border-gray-500 rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                onClick={() => handleBrandSelection(items.findIndex(item => item.name === selectedCategory), brand.price)}
              >
                <img src={brand.img} alt={brand.brand} className="w-24 h-25 object-cover rounded-lg shadow-lg" />
                <p className="mt-2 font-semibold text-lg">{brand.brand}</p>
                <p className="text-sm text-gray-300">{brand.price} tk</p>
              </div>
            ))}
          </div>
        )}

        {/* Product Table */}
        <div className="bg-gray-800 p-4 rounded-lg w-full max-w-4xl mt-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-500 text-black">
                <th className="py-2 px-4">Product</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Price (tk)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="text-red-500 border-t border-gray-600">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      className="bg-gray-700 text-white p-1 rounded w-full"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      className="bg-gray-700 text-white p-1 rounded w-full"
                      value={item.price}
                      readOnly
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="bg-green-500 text-black py-2 px-4 rounded-lg mt-4" onClick={calculateTotal}>
            Calculate Total
          </button>
          <div className="text-xl font-bold text-white mt-2">Total: {total} tk</div>
        </div>
      </div>
    </div>
  );
};
