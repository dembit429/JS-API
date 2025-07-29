import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "./logger.js";
dotenv.config();

const config = {
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD
};


const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
  host: "localhost",
  dialect: 'postgres',
  logging: (msg) => logger.info(`[SEQUILIZE] ${msg}`),
});


(async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connection successful.");
  }
  catch (err) {
    console.log(err);
  }
})();

export default sequelize;


