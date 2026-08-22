const layout = require("./layout")

module.exports = ({ name, verifyLink }) => ({
  subject: "Verify Your Email",

  text: `
Hello ${name}

Verify your email:
${verifyLink}
  `.trim(),

  html: layout({
    title: "Verify Your Email",

    body: `
      <p>Hello <strong>${name}</strong>,</p>

      <p>Welcome to AI Traveling! Please verify your email address.</p>

      <div style="margin:32px 0;text-align:center">
        <a
          href="${verifyLink}"
          style="
            background:#16A34A;
            color:#FFF;
            text-decoration:none;
            padding:14px 24px;
            border-radius:8px;
            display:inline-block;
            font-weight:bold;
          "
        >
          Verify Email
        </a>
      </div>

      <p>Or copy this URL:</p>

      <p style="word-break:break-all;color:#16A34A">
        ${verifyLink}
      </p>
    `
  })
})