
import pool from "../db.js"; 

import jwt from 'jsonwebtoken';
// import { generateAccessToken, authenticateAcessToken,generateRefreshToken } from "./middleware/authetification.js";
import bcrypt from "bcrypt";

export default class UserService {
  async createUser(name, password) {
    try {
      const userExists = await pool.query(
        `SELECT * FROM users WHERE name = $1`,
        [name]
      );

      if (userExists.rowCount > 0) {
        console.log("User already exists:", name);
        return { error: "User already exists" };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        "INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *",
        [name, hashedPassword]
      );

      console.log("User registered successfully:", result.rows[0]);
      return result.rows[0];

    } catch (err) {
      console.error("DB error:", err);
      throw new Error("Something went wrong");
    }
  }

  async getUsers(){
    try{
        const result = await pool.query(
            "SELECT * FROM users"
        );
        return result.rows;
    }catch (err) {
        console.error("DB error:", err);
        throw new Error("Something went wrong");
    }
  }

  async updateUser(id, name, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `UPDATE users SET name = $1, password = $2 WHERE id = $3 RETURNING *`,
      [name, hashedPassword, id]
    );

    if (result.rowCount === 0) {
      return null; 
    }

    return result.rows[0];
  } catch (err) {
    console.error("Update error:", err);
    throw err;
  }
}

}

export const userService = new UserService();