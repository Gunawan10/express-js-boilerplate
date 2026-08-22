const driver = process.env.DATABASE_DRIVER || "knex"

module.exports =
  driver === "sqlite"
    ? require("./sqlite")
    : require("./knex")