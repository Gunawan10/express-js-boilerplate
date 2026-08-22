const router = require("express").Router()
const upload = require("../../plugins/upload")

const controller = require("./controller")
const schema = require("./schema")
const validation = require("../../plugins/validator")

router.post(
  "/",
  validation.body(schema.bodyCreate),
  controller.create
)

router.get(
  "/",
  validation.query(schema.queryList),
  controller.getAll
)

router.patch(
  "/:user_id",
  validation.param(schema.paramUser),
  validation.body(schema.bodyUpdate),
  controller.update
)

router.patch(
  "/:user_id/avatar",
  validation.param(schema.paramUser),
  upload.single({
    maxSize: 2,
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp"
    ]
  })("file"),
  controller.updateAvatar
)

module.exports = router