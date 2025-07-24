import express from "express";
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken,authenticateAcessToken } from "../middleware/authetification.js";
import bcrypt from "bcrypt";
import UserService from "../services/user.js";



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
    const result = await userService.getUserbyName(name);

    console.log(result);

    if (!result) {
      return res.status(404).json({ error: 'Invalid credentials' });
    }

    const user = result;


    const isMatch = await bcrypt.compare(password, result.password);
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
    res.status(500).json({ error: 'Internal server error'+ err });
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
    res.status(500).json({ error: "Server error. Registration" });
  }
});



userRouter.use(authenticateAcessToken);

userRouter.get("/", async (req, res) => {
  try {
    const result = await userService.getUsers();
    res.status(200).json(result);
  } catch (err) {
    console.error("Route error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});


userRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, password } = req.body;

  try {
    const updatedUser = await userService.updateUser(Number(id), name, password);

    if(!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Error updating user: " + err.message });
  }

});



userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUser(id);
    
    if (!result) {
      return res.status(404).json({error: "User not found"});
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default userRouter;