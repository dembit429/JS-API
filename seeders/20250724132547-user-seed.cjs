"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "John Doe",
          password: "1234@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: `Maksim`,
          password: "1234634",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: `Romaus`,
          password: "4321",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
