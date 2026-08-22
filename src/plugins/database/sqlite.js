const knex = require("knex")

const db = knex({
  client: "sqlite3",
  connection: {
    filename: process.env.SQLITE_FILENAME
  },
  useNullAsDefault: true
})

const {
  applyWhere,
  applyJoin,
  applyOrder,
  applyPagination
} = require("./utils")

const {
  wrapperDatabasePlugin
} = require("../../helpers/wrapper")

module.exports = wrapperDatabasePlugin({
  async getAll(table, options = {}) {
    const query = db(table).select(
      options.select || ["*"]
    )

    applyJoin(query, options.joins)
    applyWhere(query, options.where)
    applyOrder(query, options.orderBy)

    if (options.pagination) {
      applyPagination(query, options.pagination)
    }

    return query
  },

  async findBy(table, options = {}) {
    const result = await this.getAll(table, {
      ...options,
      pagination: {
        page: 1,
        limit: 1
      }
    })

    return result[0] || null
  },

  findById(table, id, options = {}) {
    return db(table)
      .select(options.select || ["*"])
      .where({ id })
      .first()
  },

  async insert(table, payload) {
    const [id] = await db(table).insert(payload)

    return db(table)
      .where({ id })
      .first()
  },

  insertMultiple: (table, payloads) =>
    db(table).insert(payloads),

  async update(table, payload, where) {
    const query = db(table)

    applyWhere(query, where)

    return query.update(payload)
  },

  delete(table, where) {
    return this.update(
      table,
      { status: "D" },
      where
    )
  },

  async hardDelete(table, where) {
    const query = db(table)

    applyWhere(query, where)

    return query.del()
  },

  async count(table, options = {}) {
    const query = db(table).count("* as total")

    applyWhere(query, options.where)

    const [result] = await query

    return Number(result.total)
  },

  raw: (sql, bindings = []) =>
    db.raw(sql, bindings),

  transaction: (callback) =>
    db.transaction(callback)
})