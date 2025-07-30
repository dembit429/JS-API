"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "John Doe",
          password:
            "$2b$10$/IMLOCT9ctzSHh5Z49GfnuJSmMP4iy3CXmFf0k7xyg8g8ZwVVOeKq",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: `Maksim`,
          password:
            "$2b$10$/IMLOCT9ctzSHh5Z49GfnuJSmMP4iy3CXmFf0k7xyg8g8ZwVVOeKq",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: `Romaus`,
          password:
            "$2b$10$/IMLOCT9ctzSHh5Z49GfnuJSmMP4iy3CXmFf0k7xyg8g8ZwVVOeKq",
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
