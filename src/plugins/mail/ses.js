const {
  SESClient,
  SendEmailCommand
} = require("@aws-sdk/client-ses")

const { wrapperMailPlugin } = require("../../helpers/wrapper")
const templates = require("./templates")

const client = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

module.exports = wrapperMailPlugin({
  async send({
    to,
    subject,
    html,
    text
  }) {
    const command = new SendEmailCommand({
      Source: process.env.MAIL_FROM,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to]
      },
      Message: {
        Subject: {
          Data: subject
        },
        Body: {
          Html: {
            Data: html
          },
          Text: {
            Data: text || ""
          }
        }
      }
    })

    await client.send(command)
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