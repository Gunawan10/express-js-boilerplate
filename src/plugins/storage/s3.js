const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} = require("@aws-sdk/client-s3")

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { GetObjectCommand } = require("@aws-sdk/client-s3")

const { wrapperStoragePlugin } = require("../../helpers/wrapper")

const client = new S3Client({
  region: process.env.STORAGE_REGION
})

module.exports = wrapperStoragePlugin({
  async upload({
    key,
    buffer,
    contentType
  }) {
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.STORAGE_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType
      })
    )

    return {
      key,
      url: await this.getUrl({ key })
    }
  },

  async delete({ key }) {
    await client.send(
      new DeleteObjectCommand({
        Bucket: process.env.STORAGE_BUCKET,
        Key: key
      })
    )
  },

  async getUrl({ key, expires = 3600 }) {
    return getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: process.env.STORAGE_BUCKET,
        Key: key
      }),
      { expiresIn: expires }
    )
  }
})