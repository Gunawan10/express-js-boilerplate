const nodemailer = require("nodemailer")
const { wrapperMailPlugin } = require("../../helpers/wrapper")
const templates = require("./templates")

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
})

module.exports = wrapperMailPlugin({
  async send({
    to,
    subject,
    html,
    text
  }) {
    await transporter.sendMail({
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