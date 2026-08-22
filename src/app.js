const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const compression = require("compression")
const rateLimit = require("express-rate-limit")

const app = express()

app.disable("x-powered-by")

app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.json())

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false
  })
)

app.use("/health", require("./resources/health/routes"))
app.use("/users", require("./resources/users/routes"))
app.use("/ai", require("./resources/ai/routes"))

module.exports = app
