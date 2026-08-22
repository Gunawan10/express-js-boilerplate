const axios = require("axios")
const { wrapperWebhookPlugin } = require("../../helpers/wrapper")

const COLORS = {
  info: 3447003,
  success: 5763719,
  warning: 16776960,
  error: 15548997
}

module.exports = wrapperWebhookPlugin({
  async send({
    title,
    message,
    level,
    metadata
  }) {
    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
      username: process.env.WEBHOOK_USERNAME,
      avatar_url: process.env.WEBHOOK_AVATAR,
      embeds: [
        {
          title,
          description: message,
          color: COLORS[level] || COLORS.info,
          fields: Object.entries(metadata).map(([key, value]) => ({
            name: key,
            value: String(value),
            inline: true
          }))
        }
      ]
    })
  }
})