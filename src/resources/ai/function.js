const ai = require("../../plugins/ai")
const { Result } = require("../../helpers")

const generatePRD = async (body) => {
  const result = await ai.generate({
    mode: "smart",
    system: "Kamu adalah Senior Product Manager.",
    prompt: body.prompt,
    temperature: 0.3,
    maxTokens: 3000
  })

  return Result.ok(result)
}

const createEmbedding = async (body) => {
  const result = await ai.embed({
    text: body.text
  })

  return Result.ok(result, "Embedding created successfully")
}

module.exports = {
  generatePRD,
  createEmbedding
}