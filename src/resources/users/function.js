const path = require("path")

const storage = require("../../plugins/storage")
const cache = require("../../plugins/cache")
const db = require("../../plugins/database")
const { Result } = require("../../helpers/response")
const { CACHE } = require("./constant")

const TABLE = "users"

const getAll = async (query, requester) => {
  const data = await cache.remember(
    CACHE.list({
      tenant_id: requester.tenant_id,
      page: query.page,
      limit: query.limit,
      search: query.search
    }),
    300,
    async () => {
      const users = await db.getAll(TABLE, {
        select: [
          "users.id",
          "users.name",
          "users.email",
          "roles.name as role"
        ],
        joins: [
          {
            table: "roles",
            localKey: "users.role_id",
            foreignKey: "roles.id",
            type: "left"
          }
        ],
        where: {
          tenant_id: requester.tenant_id,
          status: "A",
          or: query.search
            ? [
                {
                  name: {
                    like: query.search
                  }
                },
                {
                  email: {
                    like: query.search
                  }
                }
              ]
            : []
        },
        orderBy: [
          {
            field: "users.name",
            direction: "asc"
          }
        ],
        pagination: {
          page: query.page,
          limit: query.limit
        }
      })

      const total = await db.count(TABLE, {
        where: {
          tenant_id: requester.tenant_id,
          status: "A"
        }
      })

      return {
        items: users,
        total
      }
    }
  )

  return Result.ok(data)
}

const create = async (body, requester) => {
  const user = await db.insert(TABLE, {
    ...body,
    tenant_id: requester.tenant_id,
    status: "A"
  })

  await cache.del(CACHE.list())

  return Result.created(
    user,
    "User created successfully"
  )
}

const update = async (userId, body) => {
  await db.update(
    TABLE,
    body,
    {
      id: userId
    }
  )

  await Promise.all([
    cache.del(CACHE.detail(userId)),
    cache.del(CACHE.list())
  ])

  return Result.ok(null, "User updated successfully")
}

const updateAvatar = async (userId, file, requester) => {
  const extension = path.extname(file.originalname)

  const uploaded = await storage.upload({
    key: `users/${requester.tenant_id}/${userId}/avatar${extension}`,
    buffer: file.buffer,
    contentType: file.mimetype
  })

  await db.update(
    TABLE,
    {
      avatar_key: uploaded.key
    },
    {
      id: userId,
      tenant_id: requester.tenant_id
    }
  )

  await Promise.all([
    cache.del(CACHE.detail(userId)),
    cache.del(CACHE.list())
  ])

  return Result.ok(
    {
      avatar_key: uploaded.key,
      avatar_url: uploaded.url
    },
    "Avatar updated successfully"
  )
}

module.exports = {
  getAll,
  create,
  update,
  updateAvatar
}