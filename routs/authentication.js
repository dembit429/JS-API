import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userService from "../services/user.js";
import { STATUS_CODES } from "../exceptions/statusCode.js";
import logger from "../logger/logger.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middleware/authetification.js";

const authenticationRouter = new express.Router();

authenticationRouter.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  logger.info("Received refresh token:", req.cookies.refreshToken);

  if (!token) return res.sendStatus(STATUS_CODES.Unauthorized);

  jwt.verify(
    req.cookies.refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        console.error("Refresh token verification failed:", err);
        return res.sendStatus(STATUS_CODES.CONFLICT);
      }

      res.json({ token: generateAccessToken(user) });
    },
  );
});

authenticationRouter.post("/login", async (req, res) => {
  try {
    const result = await userService.getUserbyName(req.body.name);

    if (!result) {
      return res
        .status(STATUS_CODES.Unauthorized)
        .json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      result.Data.password,
    );
    if (!isMatch) {
      return res
        .status(STATUS_CODES.Unauthorized)
        .json({ Error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(result.Data);
    const refreshToken = generateRefreshToken(result.Data);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ Token: accessToken });
  } catch (err) {
    logger.error("Login error:", err);
    res
      .status(STATUS_CODES.Internal_Server_Error)
      .json({ Error: "Internal server error: " + String(err) });
  }
});

export default authenticationRouter;
