const axios = require("axios")
const { wrapperAIPlugin } = require("../../helpers/wrapper")

const MODELS = {
  fast: "claude-3-5-haiku-latest",
  smart: "claude-sonnet-4-5",
  reasoning: "claude-sonnet-4-5"
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
      "https://api.anthropic.com/v1/messages",
      {
        model,
        system,
        temperature,
        max_tokens: maxTokens,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        }
      }
    )

    return {
      text: data.content?.[0]?.text || ""
    }
  },
  async embed() {
    throw new Error("Embedding not supported by Anthropic")
  }
})