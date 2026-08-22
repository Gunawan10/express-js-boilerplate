const express = require("express")

const app = express()

app.use(express.json())

app.use("/users", require("./resources/users/routes"))
app.use("/ai", require("./resources/ai/routes"))

module.exports = app
