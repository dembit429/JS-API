import express from "express";
import pool from "./db.js";
import jwt from 'jsonwebtoken';
import { generateAccessToken, authenticateAcessToken,generateRefreshToken } from "./middleware/authetification.js";
import bcrypt from "bcrypt";

const userRouter = express.Router();

userRouter.post('/refresh', (req, res) => {
  const token = req.cookies.refreshToken;
  console.log("Received refresh token:", token);

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("Refresh token verification failed:", err);
      return res.sendStatus(403);
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ token: newAccessToken });
  });
});


userRouter.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE name = $1',
      [name]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }


    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    res.json({ token: accessToken });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


userRouter.post("/register", async (req, res) => {
  const { name, password } = req.body;

  try {
  
    const userExists = await pool.query(
      `SELECT * FROM users WHERE name = $1`,
      [name]
    );
    
    if (userExists.rowCount > 0) {
      console.log("User already exists:", name);
      return res.status(409).json({ error: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

   
    const result = await pool.query(
      `INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *`,
      [name, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
    console.log("User registered successfully:", result.rows[0]);

  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});



userRouter.use(authenticateAcessToken);

userRouter.get("/users",async (req,res)=>{
    try{
        const result = await pool.query(
            "SELECT * FROM users"
        );
        res.status(200).json(result.rows);
    }catch(err){
        throw new Error(`Error ${err}`);
    }
});



userRouter.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, password } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET name = $1, password = $2 WHERE id = $3 RETURNING *`,
      [name, password, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json( {message : `User with ID ${id} updated successfully`});
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


userRouter.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default userRouter;