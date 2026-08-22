const driver = process.env.WEBHOOK_DRIVER || "discord"

const provider =
  driver === "slack"
    ? require("./slack")
    : driver === "mattermost"
      ? require("./mattermost")
      : require("./discord")

module.exports = provider