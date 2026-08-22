const axios = require("axios")
const { wrapperAIPlugin } = require("../../helpers/wrapper")

const MODELS = {
  fast: "gemini-2.5-flash",
  smart: "gemini-2.5-pro",
  reasoning: "gemini-2.5-pro",
  embedding: "text-embedding-004"
}

module.exports = wrapperAIPlugin({
  async generate({
    mode = "fast",
    prompt,
    system = "",
    temperature = 0.7,
    maxTokens = 2048
  }) {
    const model = MODELS[mode]

    const { data } = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        systemInstruction: {
          parts: [{ text: system }]
        },
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens
        }
      }
    )

    return {
      text: data.candidates?.[0]?.content?.parts?.[0]?.text || ""
    }
  },
  async embed({ text }) {
    const model = MODELS.embedding

    const { data } = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        content: {
          parts: [{ text }]
        }
      }
    )

    return {
      embedding: data.embedding.values
    }
  }
})