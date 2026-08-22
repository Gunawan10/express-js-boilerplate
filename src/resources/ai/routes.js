const router = require("express").Router()

const validator = require("../../plugins/validator")
const schema = require("./schema")
const controller = require("./controller")

router.post(
  "/generate",
  validator.body(schema.bodyGenerate),
  controller.generatePRD
)

router.post(
  "/embedding",
  validator.body(schema.bodyEmbedding),
  controller.embedding
)

module.exports = router
