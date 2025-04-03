# CSE299 Project SvA (Evently)
- Figma : https://www.figma.com/design/JCpOCjaSVPWS4z6BhCGBoT/CSE-299?node-id=0-1&t=W0n2sOLEhOMcHqQ7-1

# Event Expense Calculator (React Native)

## 📌 Overview
This is a **React Native** app that helps users calculate event expenses dynamically. Users can add, edit, delete, and duplicate expense rows for different categories like **Drinks, Snacks, Venue, Transportation, and Decoration**. It also features brand suggestions fetched from a backend API.

## 🚀 Features
- 🏷️ **Add new expense rows** dynamically.
- ✏️ **Edit quantity & price** for each expense.
- ➕ **Duplicate an expense row** and insert it right below its original row.
- 🗑️ **Delete an expense row**.
- 🔍 **Select brand suggestions** with an image & price from a backend API.
- 📊 **Calculate total expenses** dynamically.

## 🛠️ Tech Stack
- **React Native**
- **TypeScript**
- **React Native Async Storage** (for storing user authentication details)
- **Axios** (for API requests)
- **React Navigation** (for navigation)
- **Ionicons** (for UI icons)

## 📂 Project Structure
```
EventExpenseCalculator/
│── src/
│   ├── components/
│   │   ├── ExpenseTable.tsx  # Expense table with Add/Delete/Duplicate actions
│   │   ├── BrandModal.tsx     # Modal for brand selection
│   │   ├── CustomButton.tsx   # Reusable button component
│   │   ├── Navbar.tsx         # Top navigation bar
│   ├── screens/
│   │   ├── Calculator.tsx     # Main expense calculator screen
│   ├── context/
│   │   ├── AuthContext.tsx    # Authentication context using AsyncStorage
│   ├── App.tsx
│   ├── types.ts               # TypeScript type definitions
│── package.json
│── README.md
```

## ⚙️ Installation & Setup
1. **Clone the Repository**
   ```sh
   git clone https://github.com/mdabubokar0/CSE299-Project-SvA
   cd evently
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Run the Project**
   ```sh
   npx expo start
   ```

## 📝 API Configuration
The app fetches brand suggestions from a backend API. Ensure your backend is running at the correct URL.

Edit `API_BASE_URL` in `AuthContext.tsx`:
```ts
const API_BASE_URL = "http://your-backend-ip:8081";
```

## 🎮 Usage
1. **Login** (if authentication is enabled)
2. **Add new expense items**
3. **Select brands** from suggestions
4. **Edit quantity and price**
5. **Duplicate or delete** items
6. **Calculate total expenses**

## 🔧 Functions Breakdown
### 🆕 Adding a New Expense Row
```ts
const handleAddRow = (category: string) => {
  const newItem = {
    id: Date.now(), // Unique ID
    name: category,
    quantity: "",
    price: "",
    selectedBrand: null,
  };
  setItems([...items, newItem]);
};
```

### ✏️ Updating Quantity/Price
```ts
const handleInputChange = (id: number, field: string, value: string) => {
  setItems(items.map((item) =>
    item.id === id ? { ...item, [field]: value } : item
  ));
};
```

### ➕ Duplicating a Row
```ts
const handleDuplicateRow = (id: number) => {
  const index = items.findIndex((item) => item.id === id);
  if (index !== -1) {
    const duplicatedItem = { ...items[index], id: Date.now() };
    const newItems = [
      ...items.slice(0, index + 1),
      duplicatedItem,
      ...items.slice(index + 1),
    ];
    setItems(newItems);
  }
};
```

### 🗑️ Deleting a Row
```ts
const handleDeleteRow = (id: number) => {
  setItems(items.filter((item) => item.id !== id));
};
```

## 🎨 UI Enhancements
- **Ionicons** used for `+` and `🗑️` delete buttons.
- **Custom Modal** for brand selection.
- **Styled inputs & buttons** for better UX.

## 🏗️ Future Improvements
- ✅ Store user expenses in **AsyncStorage** for persistence.
- 📈 Add data **visualization (charts & graphs)** for expense breakdown.
- 🌎 Enable **multi-language support**.

## 🤝 Contributing
Pull requests are welcome! Feel free to submit issues and feature requests.

## 📜 License
MIT License. Free to use and modify. 🚀
