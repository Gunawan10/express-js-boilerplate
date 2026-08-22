jest.mock("../../../../src/plugins/cache", () => ({
  remember: jest.fn(),
  del: jest.fn()
}))

jest.mock("../../../../src/plugins/database", () => ({
  getAll: jest.fn(),
  count: jest.fn(),
  insert: jest.fn(),
  update: jest.fn()
}))

jest.mock("../../../../src/plugins/storage", () => ({
  upload: jest.fn()
}))

const cache = require("../../../../src/plugins/cache")
const db = require("../../../../src/plugins/database")
const storage = require("../../../../src/plugins/storage")
const user = require("../../../../src/resources/users/function")

describe("Users Function", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns users from cache when remember resolves data", async () => {
    const data = {
      items: [{ id: 1, name: "Gunawan" }],
      total: 1
    }

    cache.remember.mockResolvedValue(data)

    const result = await user.getAll(
      { page: 1, limit: 10 },
      { tenant_id: "tenant-1" }
    )

    expect(cache.remember).toHaveBeenCalled()
    expect(db.getAll).not.toHaveBeenCalled()
    expect(result).toEqual({
      success: "ok",
      data,
      message: undefined
    })
  })

  it("creates a user and clears the list cache", async () => {
    const createdUser = {
      id: 1,
      name: "Gunawan",
      email: "gunawan@example.com"
    }

    db.insert.mockResolvedValue(createdUser)
    cache.del.mockResolvedValue(undefined)

    const result = await user.create(
      {
        name: "Gunawan",
        email: "gunawan@example.com"
      },
      { tenant_id: "tenant-1" }
    )

    expect(db.insert).toHaveBeenCalledWith("users", {
      name: "Gunawan",
      email: "gunawan@example.com",
      tenant_id: "tenant-1",
      status: "A"
    })

    expect(cache.del).toHaveBeenCalled()
    expect(result.success).toBe("created")
    expect(result.data).toEqual(createdUser)
  })

  it("uploads an avatar and updates the user", async () => {
    storage.upload.mockResolvedValue({
      key: "users/tenant-1/1/avatar.png",
      url: "https://example.com/avatar.png"
    })
    db.update.mockResolvedValue(undefined)
    cache.del.mockResolvedValue(undefined)

    const file = {
      originalname: "avatar.png",
      mimetype: "image/png",
      buffer: Buffer.from("image")
    }

    const result = await user.updateAvatar(
      "1",
      file,
      { tenant_id: "tenant-1" }
    )

    expect(storage.upload).toHaveBeenCalledWith({
      key: "users/tenant-1/1/avatar.png",
      buffer: file.buffer,
      contentType: "image/png"
    })

    expect(db.update).toHaveBeenCalledWith(
      "users",
      { avatar_key: "users/tenant-1/1/avatar.png" },
      { id: "1", tenant_id: "tenant-1" }
    )

    expect(result.success).toBe("ok")
    expect(result.data).toEqual({
      avatar_key: "users/tenant-1/1/avatar.png",
      avatar_url: "https://example.com/avatar.png"
    })
  })
})
