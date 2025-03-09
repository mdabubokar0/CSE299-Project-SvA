const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const Payment = sequelize.define("Payment", {
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "BDT",
  },
  status: {
    type: DataTypes.ENUM("Pending", "Success", "Failed"),
    defaultValue: "Pending",
  },
});

module.exports = Payment;
