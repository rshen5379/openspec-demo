import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
import express from 'express'
import cors from 'cors'
import { createAIService } from './ai-service.js'

const app = express()
const aiService = createAIService()

app.use(cors())
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages is required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    for await (const token of aiService.streamChat(messages)) {
      res.write(`data: ${JSON.stringify({ token })}\n\n`)
    }
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    console.error('AI stream error:', err.message)
    if (!res.headersSent) {
      res.status(500).json({ error: 'AI 服务暂时不可用' })
    } else {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
      res.write('data: [DONE]\n\n')
      res.end()
    }
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`AI Chat backend running on http://localhost:${PORT}`)
})
