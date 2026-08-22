const driver = process.env.CACHE_DRIVER || "memory"

module.exports =
  driver === "redis"
    ? require("./redis")
    : require("./memory")