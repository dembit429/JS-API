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
import { ERROR_MESSAGES } from "../errors.js";

class UserController {
  async createUser(req, res) {
    try {
      const result = await userService.createUser(
        req.body.name,
        req.body.password,
      );

      return res.status(201).json(result);
    } catch (err) {
      logger.error("Registration error:", err.message);

      if (err.message === ERROR_MESSAGES.MISSING_CREDENTIALS) {
        return res.status(400).json({ error: "Missing credentials" });
      }
      if (err.message === ERROR_MESSAGES.USER_EXISTS) {
        return res.status(409).json({ error: "User already exists" });
      }

      res.status(500).json({ error: "Server error. Registration" });
    }
  }

  async getUsers(req, res) {
    try {
      const result = await userService.getUsers();
      res.status(200).json(result);
      logger.info(
        `[USER ROUTE] GET /users executed with code:${res.statusCode}`,
      );
    } catch (err) {
      logger.error("[GET] Error:", err);

      if (err.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(500).json({ error: err.message || "Server error" });
      logger.error({ error: err.message || "Server error" });
    }
  }

  async updateUser(req, res) {
    try {
      const updatedUser = await userService.updateUser(
        req.params.id,
        req.body.name,
        req.body.password,
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (err) {
      if (err.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return res.status(404).json({ error: "User not found" });
      }
      console.error("Error updating user:", err);
      res.status(500).json({ error: "Error updating user: " + err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await userService.deleteUser(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(result);
    } catch (err) {
      if (err.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return res.status(404).json({ error: "User not found" });
      }
      logger.error("Error deleting user:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

const userController = new UserController();
export default userController;
