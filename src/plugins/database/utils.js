const applyWhere = (query, where = {}) => {
  Object.entries(where).forEach(([key, value]) => {
    if (key === "or") {
      query.where((builder) => {
        value.forEach((condition) => {
          builder.orWhere((q) => applyWhere(q, condition))
        })
      })
      return
    }

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      if (value.like !== undefined) {
        query.where(key, "like", `%${value.like}%`)
      } else if (value.gt !== undefined) {
        query.where(key, ">", value.gt)
      } else if (value.gte !== undefined) {
        query.where(key, ">=", value.gte)
      } else if (value.lt !== undefined) {
        query.where(key, "<", value.lt)
      } else if (value.lte !== undefined) {
        query.where(key, "<=", value.lte)
      } else if (value.in !== undefined) {
        query.whereIn(key, value.in)
      } else if (value.between !== undefined) {
        query.whereBetween(key, value.between)
      }
      return
    }

    query.where(key, value)
  })
}

const applyJoin = (query, joins = []) => {
  joins.forEach((join) => {
    const method = `${join.type || "inner"}Join`

    query[method](
      join.table,
      join.localKey,
      "=",
      join.foreignKey
    )
  })
}

const applyOrder = (query, orderBy = []) => {
  orderBy.forEach((item) => {
    query.orderBy(item.field, item.direction)
  })
}

const applyPagination = (
  query,
  pagination = {}
) => {
  const page = Number(pagination.page || 1)
  const limit = Number(pagination.limit || 10)

  query.limit(limit)
  query.offset((page - 1) * limit)
}

module.exports = {
  applyWhere,
  applyJoin,
  applyOrder,
  applyPagination
}