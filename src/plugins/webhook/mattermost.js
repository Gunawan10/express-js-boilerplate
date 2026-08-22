const axios = require("axios")
const { wrapperWebhookPlugin } = require("../../helpers/wrapper")

module.exports = wrapperWebhookPlugin({
  async send({
    title,
    message,
    metadata
  }) {
    const fields = Object.entries(metadata)
      .map(([key, value]) => `**${key}** : ${value}`)
      .join("\n")

    await axios.post(process.env.MATTERMOST_WEBHOOK_URL, {
      username: process.env.WEBHOOK_USERNAME,
      icon_url: process.env.WEBHOOK_AVATAR,
      text: `### ${title}\n\n${message}\n\n${fields}`
    })
  }
})