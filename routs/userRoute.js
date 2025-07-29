import express from "express";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
  authenticateAccessToken,
} from "../middleware/authetification.js";
import bcrypt from "bcrypt";
import userService from "../services/user.js";
import logger from "../logger/logger.js";
import userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/refresh", (req, res) => {
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

userRouter.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const result = await userService.getUserbyName(name);

    console.log(result);

    if (!result) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const user = result;

    const isMatch = await bcrypt.compare(password, result.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ token: accessToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error: " + String(err) });
  }
});

userRouter.post("/register", userController.createUser);
//userRouter.use(authenticateAccessToken);
userRouter.get("/", userController.getUsers);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);
export default userRouter;
