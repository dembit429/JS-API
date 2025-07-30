import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import logger from "./logger/logger.js";
import sequelize from "./db/db.js";
import router from "./routs/index.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/", router);

// (async () => {
//   await sequelize.authenticate();
// })();
app.listen(port, () => {
  logger.info(chalk.bgCyanBright(`Server running on port: ${port}`));
});
