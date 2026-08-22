const { Resend } = require("resend")
const { wrapperMailPlugin } = require("../../helpers/wrapper")

const templates = require("./templates")

const resend = new Resend(process.env.RESEND_API_KEY)

module.exports = wrapperMailPlugin({
  async send({
    to,
    subject,
    html,
    text
  }) {
    await resend.emails.send({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
      text
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
      html: content.html
    })
  }
})