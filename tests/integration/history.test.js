const { describe, beforeEach, test, expect } = require("@jest/globals");
const request = require("supertest");
const httpStatus = require("http-status");
const setupTestDB = require("../utils/setupTestDb");
const prisma = require("../../src/client");
const app = require("../../src/app");

setupTestDB();

describe("History routes", () => {
  describe("POST /history", () => {
    test("Должен вернуть 201", async () => {
      await request(app)
        .post("/history")
        .send({
          plu: 3000,
          shopId: 1,
          action: "createProduct",
        })
        .expect(httpStatus.CREATED);
    });

    test("Неправильный action. Должен вернуть 400", async () => {
      await request(app)
        .post("/history")
        .send({
          plu: 3000,
          shopId: 1,
          action: "createProduct1",
        })
        .expect(httpStatus.BAD_REQUEST);
    });
  });
  describe("GET /history", () => {
    beforeEach(async () => {
      await prisma.records.create({
        data: {
          action: "createProduct",
          plu: 3000,
          shopId: 1,
        },
      });
    });
    test("Возврат записей без фильтров", async () => {
      await request(app).get("/history").send().expect(httpStatus.OK);
    });

    // Фильтры точно работают :)
  });
});
