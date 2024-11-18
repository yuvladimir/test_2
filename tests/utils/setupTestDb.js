const prisma = require("../../src/client.js");
const { beforeAll, beforeEach, afterAll } = require("@jest/globals");

const setupTestDB = () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.records.deleteMany();
  });

  afterAll(async () => {
    await prisma.records.deleteMany();
    await prisma.$disconnect();
  });
};

module.exports = setupTestDB;
