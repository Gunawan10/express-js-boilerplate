const { wrapperController, requester } = require("../../helpers")
const user = require("./function")

module.exports = {
  create: wrapperController((req) =>
    user.create(req.body, requester(req))
  ),

  getAll: wrapperController((req) =>
    user.getAll(req.query, requester(req))
  ),

  update: wrapperController((req) =>
    user.update(
      req.params.user_id,
      req.body,
      requester(req)
    )
  ),

  updateAvatar: wrapperController((req) =>
    user.updateAvatar(
      req.params.user_id,
      req.file,
      requester(req)
    )
  )
}