const driver = process.env.AI_DRIVER || "gemini"

module.exports =
  driver === "deepseek"
    ? require("./deepseek")
    : driver === "anthropic"
      ? require("./anthropic")
      : require("./gemini")