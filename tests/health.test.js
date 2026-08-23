jest.mock("../src/resources/users/routes", () => require("express").Router())
jest.mock("../src/resources/ai/routes", () => require("express").Router())

const request = require("supertest")
const app = require("../src/app")

describe("GET /health", () => {
  it("should return application health status", async () => {
    const response = await request(app).get("/health")

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      success: true,
      data: {
        status: "ok"
      }
    })
  })
})
