import express from "express";
import pool from "./db.js";
import jwt from 'jsonwebtoken';
import { generateAccessToken, authenticateAcessToken,generateRefreshToken } from "./middleware/authetification.js";
import bcrypt from "bcrypt";
import UserService from "./services/user.js";

const userService = new UserService();
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
    const result = await userService.createUser(name, password);

    if (result.error) {
      return res.status(409).json(result);
    }

    return res.status(201).json(result);

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




userRouter.use(authenticateAcessToken);

userRouter.get("/",async (req,res)=>{
    try{
        const result = await userService.getUsers();
        res.status(200).json(result);
    }catch(err){
        throw new Error(`Error ${err}`);
    }
});


userRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, password } = req.body;
  try {
    const updatedUser = await userService.updateUser(id, name, password);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



userRouter.delete("/:id", async (req, res) => {
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