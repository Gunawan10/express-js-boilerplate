const { Result, sendResponse } = require("../../../src/helpers/response")

describe("Result Pattern", () => {
  it("returns a successful result", () => {
    expect(Result.ok({ id: 1 }, "Success")).toEqual({
      success: "ok",
      data: { id: 1 },
      message: "Success"
    })
  })

  it("returns a created result", () => {
    expect(Result.created({ id: 1 }, "Created")).toEqual({
      success: "created",
      data: { id: 1 },
      message: "Created"
    })
  })

  it("returns an error result", () => {
    expect(Result.notFound("User not found")).toEqual({
      error: "notFound",
      message: "User not found"
    })
  })
})

describe("sendResponse", () => {
  it("maps a success result to an HTTP response", () => {
    const json = jest.fn()
    const res = {
      status: jest.fn(() => ({ json }))
    }

    sendResponse(res, Result.ok({ id: 1 }, "Success"))

    expect(res.status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalledWith({
      success: true,
      message: "Success",
      data: { id: 1 }
    })
  })

  it("maps an error result to an HTTP response", () => {
    const json = jest.fn()
    const res = {
      status: jest.fn(() => ({ json }))
    }

    sendResponse(res, Result.notFound("User not found"))

    expect(res.status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({
      error: true,
      code: 404,
      message: "User not found"
    })
  })
})
