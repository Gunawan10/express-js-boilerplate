const { createClient } = require("redis")
const { wrapperCachePlugin } = require("../../helpers/wrapper")

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  },
  password: process.env.REDIS_PASSWORD || undefined
})

client.connect()

module.exports = wrapperCachePlugin({
  async get(key) {
    const value = await client.get(key)

    return value ? JSON.parse(value) : null
  },

  async set(key, value, ttl = 300) {
    await client.set(
      key,
      JSON.stringify(value),
      {
        EX: ttl
      }
    )
  },

  del: (key) => client.del(key),

  async has(key) {
    return (await client.exists(key)) === 1
  },

  async remember(key, ttl, callback) {
    const cached = await this.get(key)

    if (cached) return cached

    const data = await callback()

    await this.set(key, data, ttl)

    return data
  },

  clear: () => client.flushDb()
})