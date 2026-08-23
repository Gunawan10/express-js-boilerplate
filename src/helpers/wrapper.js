const { sendResponse, restApi } = require("./response")

const wrapperController = (handler) => {
  return async (req, res) => {
    try {
      const result = await handler(req)

      return sendResponse(res, result)
    } catch (error) {
      const webhook = require("../plugins/webhook")

      await webhook.sendError({
        error,
        context: {
          endpoint: req.originalUrl,
          method: req.method,
          params: req.params,
          query: req.query
        }
      })

      return restApi.error(res)
    }
  }
}

const wrapperAIPlugin = (implementation) => ({
  generate: (params) => implementation.generate(params),
  embed: (params) => implementation.embed(params)
})

const wrapperValidatorPlugin = (implementation) => ({
  body: (schema) => implementation.body(schema),
  query: (schema) => implementation.query(schema),
  param: (schema) => implementation.param(schema)
})

const wrapperStoragePlugin = (implementation) => ({
  upload: (params) => implementation.upload(params),
  delete: (params) => implementation.delete(params),
  getUrl: (params) => implementation.getUrl(params)
})

const wrapperUploadPlugin = (implementation) => ({
  single: implementation.single,
  array: implementation.array
})

const wrapperDatabasePlugin = (implementation) => ({
  getAll: implementation.getAll,
  findBy: implementation.findBy,
  findById: implementation.findById,

  insert: implementation.insert,
  insertMultiple: implementation.insertMultiple,

  update: implementation.update,
  delete: implementation.delete,
  hardDelete: implementation.hardDelete,

  count: implementation.count,

  raw: implementation.raw,
  transaction: implementation.transaction
})

const wrapperMailPlugin = (implementation) => ({
  send: implementation.send,
  sendTemplate: implementation.sendTemplate
})

const wrapperCachePlugin = (implementation) => ({
  get: implementation.get,
  set: implementation.set,
  del: implementation.del,
  has: implementation.has,
  remember: implementation.remember,
  clear: implementation.clear
})

const wrapperWebhookPlugin = (implementation) => ({
  send: async ({
    title,
    message,
    level = "info",
    metadata = {}
  }) => {
    return implementation.send({
      title,
      message,
      level,
      metadata
    })
  },
  sendError: async ({
    title = "Unhandled Exception",
    error,
    context = {}
  }) => {
    return implementation.send({
      title,
      message: error.message,
      level: "error",
      metadata: {
        ...context,
        stack: error.stack
      }
    })
  }
})

module.exports = {
  wrapperController,
  wrapperAIPlugin,
  wrapperValidatorPlugin,
  wrapperStoragePlugin,
  wrapperUploadPlugin,
  wrapperDatabasePlugin,
  wrapperMailPlugin,
  wrapperCachePlugin,
  wrapperWebhookPlugin
}
