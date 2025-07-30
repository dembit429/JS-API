import { STATUS_CODES } from "../exceptions/statusCode.js";
import userService from "../services/user.js";
import logger from "../logger/logger.js";
import { ERROR_MESSAGES } from "../exceptions/errors.js";

class UserController {
  async createUser(req, res) {
    try {
      const result = await userService.createUser(
        req.body.name,
        req.body.password,
      );

      return res.status(STATUS_CODES.CREATED).json(result);
    } catch (err) {
      logger.error("Registration error:", err.message);

      if (err.message === ERROR_MESSAGES.MISSING_CREDENTIALS) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ Error: "Missing credentials" });
      }
      if (err.message === ERROR_MESSAGES.USER_EXISTS) {
        return res
          .status(STATUS_CODES.CONFLICT)
          .json({ Error: "User already exists" });
      }

      res
        .status(STATUS_CODES.Internal_Server_Error)
        .json({ Error: "Server error. Registration" });
    }
  }

  async getUsers(req, res) {
    try {
      const result = await userService.getUsers();
      res.status(STATUS_CODES.OK).json(result);
      logger.info(
        `[USER ROUTE] GET /users executed with code:${res.statusCode}`,
      );
    } catch (err) {
      logger.error("[GET] Error:", err);

      if (err.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ Error: "User not found" });
      }

      res
        .status(STATUS_CODES.Internal_Server_Error)
        .json({ Error: err.message || "Server error" });
      logger.error({ Error: err.message || "Server error" });
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
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ Error: "User not found" });
      }

      res.status(STATUS_CODES.OK).json(updatedUser);
    } catch (err) {
      if (err.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ Error: "User not found" });
      }
      logger.error("Error updating user:", err);
      res
        .status(STATUS_CODES.Internal_Server_Error)
        .json({ Error: "Error updating user: " + err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await userService.deleteUser(req.params.id);
      if (!result) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ Error: "User not found" });
      }
      res.status(STATUS_CODES.OK).json(result);
    } catch (err) {
      if (err.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ Error: "User not found" });
      }
      logger.error("Error deleting user:", err);
      res
        .status(STATUS_CODES.Internal_Server_Error)
        .json({ Error: "Internal server error" });
    }
  }
}

const userController = new UserController();
export default userController;
