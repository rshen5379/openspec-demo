import OpenAI from 'openai'

export function createAIService() {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  })
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

  async function* streamChat(messages, requestedModel) {
    const useModel = requestedModel || model
    const stream = await client.chat.completions.create({
      model: useModel,
      messages,
      stream: true
    })

    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content
      if (content) {
        yield content
      }
    }
  }

  return { streamChat }
}
