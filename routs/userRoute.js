import express from "express";
import { authenticateAccessToken } from "../middleware/authetification.js";
import userController from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.post("/register", userController.createUser);
userRouter.use(authenticateAccessToken);
userRouter.get("/", userController.getUsers);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);
export default userRouter;
