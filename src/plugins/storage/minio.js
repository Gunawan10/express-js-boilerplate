const Minio = require("minio")
const { wrapperStoragePlugin } = require("../../helpers/wrapper")

const client = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
})

module.exports = wrapperStoragePlugin({
  async upload({ key, buffer, contentType }) {
    await client.putObject(
      process.env.STORAGE_BUCKET,
      key,
      buffer,
      {
        "Content-Type": contentType
      }
    )

    return {
      key,
      url: await this.getUrl({ key })
    }
  },

  async delete({ key }) {
    await client.removeObject(
      process.env.STORAGE_BUCKET,
      key
    )
  },

  async getUrl({ key, expires = 3600 }) {
    return client.presignedGetObject(
      process.env.STORAGE_BUCKET,
      key,
      expires
    )
  }
})