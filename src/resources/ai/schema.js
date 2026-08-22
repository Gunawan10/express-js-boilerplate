module.exports = {
  bodyGenerate: {
    prompt: {
      type: "string",
      required: true,
      min: 10,
      trim: true
    }
  },
  bodyEmbedding: {
    text: {
      type: "string",
      required: true,
      min: 1,
      trim: true
    }
  }
}
