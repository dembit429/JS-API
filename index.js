import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routs.js'; 
import chalk from 'chalk';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.use("/",userRouter);

app.listen(port, () => {
  console.log(chalk.bgCyanBright(`Server running on port ${port}`));
});
