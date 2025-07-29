import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "orders",
    timestamps: false,
  },
);

export default Order;
