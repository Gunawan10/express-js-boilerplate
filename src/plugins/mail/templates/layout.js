module.exports = ({
  title,
  body,
  footer = "© AI Traveling. All rights reserved."
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0;background:#F4F7FB;font-family:Arial,sans-serif">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:32px">

        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          style="
            background:#FFFFFF;
            border-radius:12px;
            overflow:hidden;
          "
        >

          <tr>
            <td
              style="
                background:#2563EB;
                color:#FFFFFF;
                padding:24px;
                font-size:22px;
                font-weight:bold;
              "
            >
              ✈️ AI Traveling
            </td>
          </tr>

          <tr>
            <td style="padding:32px">
              <h2 style="margin-top:0">${title}</h2>

              ${body}
            </td>
          </tr>

          <tr>
            <td
              style="
                background:#F8FAFC;
                padding:20px;
                font-size:12px;
                color:#64748B;
                text-align:center;
              "
            >
              ${footer}
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`