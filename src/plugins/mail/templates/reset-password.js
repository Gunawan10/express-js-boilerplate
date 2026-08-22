const layout = require("./layout")

module.exports = ({ name, resetLink }) => ({
  subject: "Reset Your Password",

  text: `
Hello ${name}

Reset your password here:
${resetLink}
  `.trim(),

  html: layout({
    title: "Reset Password",

    body: `
      <p>Hello <strong>${name}</strong>,</p>

      <p>We received a request to reset your password.</p>

      <div style="margin:32px 0;text-align:center">
        <a
          href="${resetLink}"
          style="
            background:#2563EB;
            color:#FFF;
            text-decoration:none;
            padding:14px 24px;
            border-radius:8px;
            display:inline-block;
            font-weight:bold;
          "
        >
          Reset Password
        </a>
      </div>

      <p>Or copy this URL:</p>

      <p style="word-break:break-all;color:#2563EB">
        ${resetLink}
      </p>

      <p style="margin-top:24px;color:#64748B">
        This link expires in 30 minutes.
      </p>
    `
  })
})