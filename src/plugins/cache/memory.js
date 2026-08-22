const { wrapperCachePlugin } = require("../../helpers/wrapper")

const store = new Map()

module.exports = wrapperCachePlugin({
  async get(key) {
    const item = store.get(key)

    if (!item) return null

    if (Date.now() > item.expiredAt) {
      store.delete(key)
      return null
    }

    return item.value
  },

  async set(key, value, ttl = 300) {
    store.set(key, {
      value,
      expiredAt: Date.now() + ttl * 1000
    })
  },

  async del(key) {
    store.delete(key)
  },

  async has(key) {
    return (await this.get(key)) !== null
  },

  async remember(key, ttl, callback) {
    const cached = await this.get(key)

    if (cached) return cached

    const data = await callback()

    await this.set(key, data, ttl)

    return data
  },

  async clear() {
    store.clear()
  }
})