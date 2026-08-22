const postmark = require("postmark")

const { wrapperMailPlugin } = require("../../helpers/wrapper")
const templates = require("./templates")

const client = new postmark.ServerClient(
  process.env.POSTMARK_SERVER_TOKEN
)

module.exports = wrapperMailPlugin({
  async send({
    to,
    subject,
    html,
    text
  }) {
    await client.sendEmail({
      From: process.env.MAIL_FROM,
      To: Array.isArray(to) ? to.join(",") : to,
      Subject: subject,
      HtmlBody: html,
      TextBody: text || "",
      MessageStream:
        process.env.POSTMARK_MESSAGE_STREAM || "outbound"
    })
  },

  async sendTemplate({
    to,
    template,
    data
  }) {
    const content = templates[template](data)

    return this.send({
      to,
      subject: content.subject,
      html: content.html,
      text: content.text
    })
  }
})