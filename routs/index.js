import authenticationRouter from "../routs/authentication.js";
import userRouter from "./userRoute.js";
import express from "express";

const router = express.Router();

router.use("/users", userRouter);
router.use("/auth", authenticationRouter);

export default router;
