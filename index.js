import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routs/userRoute.js'; 
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/users",userRouter);

app.listen(port, () => {
  console.log(chalk.bgCyanBright(`Server running on port ${port}`));
});
