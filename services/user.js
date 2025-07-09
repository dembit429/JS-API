import pool from "/JS-API/db.js";
import jwt from 'jsonwebtoken';
// import { generateAccessToken, authenticateAcessToken,generateRefreshToken } from "./middleware/authetification.js";
import bcrypt from "bcrypt";

export class UserService {
    async createUser(name, password) {
        try{
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
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hashedPassword]
        );
        console.log("User registered successfully:", result.rows[0]);
        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Something went wrong" });
    }


}

}

export default UserService;

