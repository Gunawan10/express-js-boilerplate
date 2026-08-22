const CACHE = {
  list: (query = {}) =>
    `users:list:${JSON.stringify(query)}`,

  detail: (id) =>
    `users:detail:${id}`
}

module.exports = {
  CACHE
}