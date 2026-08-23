jest.mock("../../../src/plugins/validator", () => ({
  body: () => (req, res, next) => next(),
  query: () => (req, res, next) => next(),
  param: () => (req, res, next) => next()
}))

jest.mock("../../../src/plugins/upload", () => ({
  single: () => () => (req, res, next) => next()
}))

jest.mock("../../../src/plugins/webhook", () => ({
  send: jest.fn().mockResolvedValue(undefined),
  sendError: jest.fn().mockResolvedValue(undefined)
}))

jest.mock("../../../src/resources/users/function", () => ({
  create: jest.fn().mockResolvedValue({
    success: "created",
    data: { id: 1, name: "Gunawan" },
    message: "User created successfully"
  }),
  getAll: jest.fn().mockResolvedValue({
    success: "ok",
    data: {
      items: [{ id: 1, name: "Gunawan" }],
      total: 1
    },
    message: "Success"
  })
}))

const express = require("express")
const request = require("supertest")
const userRoutes = require("../../../src/resources/users/routes")
const user = require("../../../src/resources/users/function")

const app = express()
app.use(express.json())
app.use("/users", userRoutes)

describe("Users API", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("creates a user through the HTTP flow", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "Gunawan",
        email: "gunawan@example.com"
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      success: true,
      message: "User created successfully",
      data: { id: 1, name: "Gunawan" }
    })

    expect(user.create).toHaveBeenCalled()
  })

  it("returns the users list through the HTTP flow", async () => {
    const response = await request(app)
      .get("/users")
      .query({ page: 1, limit: 10 })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      success: true,
      message: "Success",
      data: {
        items: [{ id: 1, name: "Gunawan" }],
        total: 1
      }
    })

    expect(user.getAll).toHaveBeenCalled()
  })
})
