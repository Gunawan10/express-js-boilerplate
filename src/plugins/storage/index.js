const driver = process.env.STORAGE_DRIVER || "s3"

module.exports =
  driver === "r2"
    ? require("./r2")
    : driver === "minio"
      ? require("./minio")
      : require("./s3")