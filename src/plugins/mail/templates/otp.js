const layout = require("./layout")

module.exports = ({ name, code }) => ({
  subject: "Your OTP Code",

  text: `
Hello ${name}

Your OTP Code: ${code}

This code expires in 10 minutes.
  `.trim(),

  html: layout({
    title: "Email Verification",

    body: `
      <p>Hello <strong>${name}</strong>,</p>

      <p>Your verification code is:</p>

      <div
        style="
          background:#EFF6FF;
          border:1px dashed #2563EB;
          border-radius:10px;
          padding:18px;
          text-align:center;
          font-size:32px;
          letter-spacing:8px;
          font-weight:bold;
          color:#1D4ED8;
          margin:24px 0;
        "
      >
        ${code}
      </div>

      <p>This code will expire in <strong>10 minutes</strong>.</p>
    `
  })
})