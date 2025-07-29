import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  },
);

export default User;
