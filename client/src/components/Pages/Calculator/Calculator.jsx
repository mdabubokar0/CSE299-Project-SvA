import React, { useState } from "react";
import { Navbar } from "../../Navbar/Navbar";

export const Calculator = () => {
  const [items, setItems] = useState([
    { name: "Water", quantity: "", price: "" },
    { name: "Juice & Drinks", quantity: "", price: "" },
    { name: "Snacks", quantity: "", price: "" },
    { name: "Vanue Cost", quantity: "", price: "" },
    { name: "Transportation", quantity: "", price: "" },
    { name: "Decoration", quantity: "", price: "" },
  ]);
  
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [total, setTotal] = useState(0);
  
  const handleInputChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    const totalAmount = items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) * parseFloat(item.price) || 0);
    }, 0);
    setTotal(totalAmount);
  };

  const handleButtonClick = (value) => {
    if (value === "C") {
      setExpression("");
      setResult("0");
    } else if (value === "=") {
      try {
        setResult(eval(expression).toString());
      } catch {
        setResult("Error");
      }
    } else {
      setExpression((prev) => prev + value);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gray-900 min-h-screen p-4 text-gray-100 flex flex-col items-center">
      <div className="bg-green-300 text-black text-center py-4 rounded-xl text-2xl font-bold w-full max-w-4xl">
        Budget Calculator
      </div>
      
      <div className="flex flex-wrap mt-6 w-full max-w-4xl gap-6">
        {/* Sidebar Categories */}
        <div className="flex flex-col gap-4 w-1/4">
          {items.map((item, index) => (
            <button key={index} className="bg-green-200 text-black py-2 rounded-lg text-lg w-full">
              {item.name}
            </button>
          ))}
        </div>
        
        {/* Table and Calculator */}
        <div className="flex flex-col w-3/4 gap-6">
          {/* Table */}
          <div className="bg-gray-800 p-4 rounded-lg w-full overflow-x-auto">
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
                        onChange={(e) => handleInputChange(index, "price", e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button 
              className="bg-green-500 text-black py-2 px-4 rounded-lg mt-4" 
              onClick={calculateTotal}
            >
              Calculate Total
            </button>
            <div className="text-xl font-bold text-white mt-2">Total: {total} tk</div>
          </div>
          
          {/* Calculator */}
          <div className="bg-gray-800 p-4 rounded-lg w-full">
            <div className="text-right text-xl p-2 bg-gray-700 rounded">{expression || "0"}</div>
            <div className="text-right text-3xl p-2 bg-gray-700 rounded mt-2">{result}</div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {["+", "C", "%", "÷", "1", "2", "3", "×", "4", "5", "6", "-", "7", "8", "9", "CE", "0", ".", "=",]
                .map((btn, index) => (
                  <button 
                    key={index} 
                    className={`py-4 rounded text-lg font-bold w-full ${
                      ["C"].includes(btn) ? "bg-purple-700 text-white" : "bg-gray-600 text-white"
                    }`} 
                    onClick={() => handleButtonClick(btn === "×" ? "*" : btn === "÷" ? "/" : btn)}
                  >
                    {btn}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

