const axios = require("axios")
const { wrapperAIPlugin } = require("../../helpers/wrapper")

const MODELS = {
  fast: "deepseek-chat",
  smart: "deepseek-chat",
  reasoning: "deepseek-reasoner"
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
      "https://api.deepseek.com/chat/completions",
      {
        model,
        messages: [
          {
            role: "system",
            content: system
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature,
        max_tokens: maxTokens
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
        }
      }
    )

    return {
      text: data.choices[0].message.content
    }
  },
  async embed() {
    throw new Error("Embedding not supported by DeepSeek")
  }
})