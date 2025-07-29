import User from "../db/models/userModel.js";
import bcrypt from "bcrypt";
import { ERROR_MESSAGES } from "../errors.js";
import logger from "../logger/logger.js";

class UserService {
  async createUser(name, password) {
    try {
      if (!name || !password) {
        throw new Error(ERROR_MESSAGES.MISSING_CREDENTIALS);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [user, created] = await User.findOrCreate({
        where: { name },
        defaults: {
          password: hashedPassword,
        },
      });

      if (!created) {
        throw new Error(ERROR_MESSAGES.USER_EXISTS);
      }

      logger.info("User registered successfully:", user.toJSON());
      return user;
    } catch (err) {
      logger.error("DB error:", err);
      throw err;
    }
  }

  async getUsers() {
    try {
      const users = await User.findAll();

      if (users.length === 0) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      return users;
    } catch (err) {
      logger.error("DB error:", err);
      throw err;
    }
  }

  async getUserbyName(name) {
    try {
      const result = await User.findOne({ where: { name: name } });
      logger.log(result);

      if (!result) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }
      return result;
    } catch (err) {
      logger.error("DB error:", err);
      throw err;
    }
  }

  async updateUser(userId, newName, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const [result] = await User.update(
        { name: newName, password: hashedPassword },
        { where: { id: userId } },
      );

      if (!result) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }
      return User.findByPk(userId);
    } catch (err) {
      logger.error("Update error:", err);
      throw err;
    }
  }

  async deleteUser(userId) {
    try {
      const result = await User.destroy({
        where: { id: userId },
      });
      if (!result) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      return { Delete: `User ${userId} deleted successfully.` };
    } catch (err) {
      logger.error("Delete error:", err);
      throw err;
    }
  }
}

const userService = new UserService();
export default userService;
