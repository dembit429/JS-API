import { Sequelize } from "sequelize";
import logger from "../logger/logger.js";
import config from "../config/config.js";

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: "localhost",
    dialect: "postgres",
    logging: (msg) => logger.info(`[SEQUILIZE] ${msg}`),
  },
);

export default sequelize;
