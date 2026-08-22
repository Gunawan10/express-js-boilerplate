const {
  wrapperController
} = require("../../helpers")

const {
  generatePRD,
  createEmbedding
} = require("./function")

module.exports = {
  generatePRD: wrapperController((req) =>
    generatePRD(req.body)
  ),
  embedding: wrapperController((req) =>
    createEmbedding(req.body)
  )
}
