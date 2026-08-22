const driver = process.env.MAIL_DRIVER || "smtp"

switch (driver) {
  case "resend":
    module.exports = require("./resend")
    break

  case "ses":
    module.exports = require("./ses")
    break

  case "postmark":
    module.exports = require("./postmark")
    break

  default:
    module.exports = require("./smtp")
}