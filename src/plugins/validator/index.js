const driver = process.env.VALIDATOR_DRIVER || "joi"

module.exports =
  driver === "zod"
    ? require("./zod")
    : require("./joi")