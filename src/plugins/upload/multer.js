const multer = require("multer")
const { restApi } = require("../../helpers/response")
const { wrapperUploadPlugin } = require("../../helpers/wrapper")

const storage = multer.memoryStorage()

const createUploader = ({
  maxSize = 5,
  mimeTypes = []
} = {}) =>
  multer({
    storage,
    limits: {
      fileSize: maxSize * 1024 * 1024
    },
    fileFilter(req, file, callback) {
      if (
        mimeTypes.length &&
        !mimeTypes.includes(file.mimetype)
      ) {
        return callback(new Error("INVALID_FILE"))
      }

      callback(null, true)
    }
  })

module.exports = wrapperUploadPlugin({
  single(options) {
    const upload = createUploader(options)

    return (field) => (req, res, next) => {
      upload.single(field)(req, res, (err) => {
        if (err) return restApi.bad(res)

        next()
      })
    }
  },

  array(options) {
    const upload = createUploader(options)

    return (field, count) => (req, res, next) => {
      upload.array(field, count)(req, res, (err) => {
        if (err) return restApi.bad(res)

        next()
      })
    }
  }
})