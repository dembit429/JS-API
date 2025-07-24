import User from "../Orm_models/userModel.js"
import bcrypt from "bcrypt";

export default class UserService {

  async createUser(name, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const [user, created] = await User.findOrCreate({
        where: { name },
        defaults: {
          password: hashedPassword,
        },
      });

      if (!created) {
        console.log("User already exists:", name);
        return { error: "User already exists" };
      }

      console.log("User registered successfully:", user.toJSON());
      
      return user;

    } catch (err) {
      console.error("DB error:", err);
      throw new Error("Something went wrong");
    }
  }


  async getUsers() {
    try {
      const result = await User.findAll();
      return result;
    } catch (err) {
      console.error("DB error:", err);
      throw new Error("Something went wrong");
    }
  }


  async getUserbyName(name) {
    try {
      const result = await User.findOne({ where: { name: name } });
      console.log(result);

      if (result === null){
        return null;
      } 
      return result;
    } catch (err) {
      console.error("DB error:", err);
      throw new Error("Something went wrong");
    }
  }

  async updateUser(userId, newName, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const [result] = await User.update(
        { name: newName, password: hashedPassword },
        { where: { id: userId } }
      );

      if(result === 0){
        return null;
      }
      const updatedUser = await User.findByPk(userId);
      return updatedUser;
    } catch (err) {
      console.error("Update error:", err);
      throw err;
    }
  }

  async deleteUser(userId) {
    try {
      const result = await User.destroy({
        where:{id:userId}
      })
      if(result === 0){
        return null;
      }
      
      return {Delete: `User ${userId} deleted successfully.`}
    } catch (err) {
      console.error("Delete error:", err);
      throw err;
    }
  }

}

export const userService = new UserService();