const axios = require("axios")
const { wrapperWebhookPlugin } = require("../../helpers/wrapper")

module.exports = wrapperWebhookPlugin({
  async send({
    title,
    message,
    metadata
  }) {
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      username: process.env.WEBHOOK_USERNAME,
      icon_url: process.env.WEBHOOK_AVATAR,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: title
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: message
          }
        },
        {
          type: "section",
          fields: Object.entries(metadata).map(([key, value]) => ({
            type: "mrkdwn",
            text: `*${key}*\n${value}`
          }))
        }
      ]
    })
  }
})