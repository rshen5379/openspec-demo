import { useState, useRef, useEffect, useCallback } from 'react'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { useTheme } from './useTheme'

marked.setOptions({
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  }
})

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
}

function Avatar({ role, colors }) {
  const bg = role === 'assistant' ? colors.aiAvatarBg : colors.userAvatarBg
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {role === 'assistant' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8" y2="16" />
          <line x1="16" y1="16" x2="16" y2="16" />
          <line x1="9" y1="21" x2="9" y2="23" />
          <line x1="15" y1="21" x2="15" y2="23" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )}
    </div>
  )
}

const STORAGE_KEY = 'ai-chat-messages'

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMessages(msgs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs))
  } catch {
    // localStorage 满或不可用时静默忽略
  }
}

function MessageBubble({ msg, colors }) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  const handleCopy = useCallback(() => {
    copyToClipboard(msg.content)
    setCopied(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopied(false), 1500)
  }, [msg.content])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  if (msg.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, gap: 8, alignItems: 'flex-end' }}>
        <div style={{ position: 'relative' }}>
          <div
            onClick={handleCopy}
            style={{
              maxWidth: '75%', padding: '8px 14px', borderRadius: 12,
              background: colors.userBubble, color: colors.userBubbleText,
              fontSize: 13, lineHeight: 1.5, cursor: 'pointer'
            }}
          >
            {msg.content}
          </div>
          {copied && (
            <span style={{
              position: 'absolute', bottom: -22, right: 0,
              fontSize: 11, color: colors.textMuted,
              background: colors.bg, padding: '2px 6px', borderRadius: 4,
              border: `1px solid ${colors.border}`,
              whiteSpace: 'nowrap',
            }}>
              已复制
            </span>
          )}
        </div>
        <Avatar role="user" colors={colors} />
      </div>
    )
  }

  const html = marked.parse(msg.content || '')

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12, gap: 8, alignItems: 'flex-start' }}>
      <Avatar role="assistant" colors={colors} />
      <div style={{ position: 'relative' }}>
        <div style={{
          maxWidth: '85%', padding: '8px 14px', borderRadius: 12,
          background: colors.aiBubble, color: colors.aiBubbleText,
          fontSize: 13, lineHeight: 1.5, overflowX: 'auto', cursor: 'pointer'
        }}
          onClick={handleCopy}
        >
          <div
            className="ai-message"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
        {copied && (
          <span style={{
            position: 'absolute', bottom: -22, left: 0,
            fontSize: 11, color: colors.textMuted,
            background: colors.bg, padding: '2px 6px', borderRadius: 4,
            border: `1px solid ${colors.border}`,
            whiteSpace: 'nowrap',
          }}>
            已复制
          </span>
        )}
      </div>
    </div>
  )
}

function TypingIndicator({ colors }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12, gap: 8, alignItems: 'flex-start' }}>
      <Avatar role="assistant" colors={colors} />
      <div style={{
        padding: '8px 14px', borderRadius: 12,
        background: colors.aiBubble, color: colors.textMuted, fontSize: 13
      }}>
        AI 正在思考...
      </div>
    </div>
  )
}

function ThemeToggle({ theme, toggle, colors }) {
  return (
    <button
      onClick={toggle}
      title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
      style={{
        width: 30, height: 30, borderRadius: 6,
        border: `1px solid ${colors.border}`,
        background: 'transparent', color: colors.textMuted,
        cursor: 'pointer', fontSize: 15, display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}

function formatDate() {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  }).format(new Date())
}

function formatTime() {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(new Date())
}

function DateDisplay({ colors }) {
  const [date, setDate] = useState(formatDate)
  const [clock, setClock] = useState(formatTime)

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(formatDate())
      setClock(formatTime())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{
      position: 'fixed', top: 16, right: 24,
      color: colors.textMuted, letterSpacing: 0.5,
      zIndex: 100, textAlign: 'right', lineHeight: 1.6,
    }}>
      <div style={{ fontSize: 14 }}>{date}</div>
      <div style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{clock}</div>
    </div>
  )
}

const INTRO_MESSAGE = {
  role: 'assistant',
  content: `你好！👋 我是 **AI 智能助手**，很高兴为你服务。

**我能做什么：**
- 回答各类知识问题
- 协助编写和调试代码
- 帮你分析和整理信息
- 进行创意写作和头脑风暴

请随时输入你的问题，我会实时为你解答！`
}

export default function App() {
  const { theme, colors, toggle } = useTheme()
  const [messages, setMessages] = useState(() => loadMessages())
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const introducedRef = useRef(false)
  const messagesEndRef = useRef(null)
  const abortRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    saveMessages(messages)
  }, [messages])

  useEffect(() => {
    if (!open) return
    if (!introducedRef.current) {
      introducedRef.current = true
      if (messages.length === 0) {
        setMessages([INTRO_MESSAGE])
      }
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setLoading(true)

    const userMsg = { role: 'user', content: text }
    const aiMsg = { role: 'assistant', content: '' }
    const newMessages = [...messages, userMsg, aiMsg]
    setMessages(newMessages)

    const apiMessages = [...messages, userMsg].map(m => ({
      role: m.role, content: m.content
    }))

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal
      })

      if (!res.ok) throw new Error('AI 服务暂时不可用')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              if (parsed.error) throw new Error(parsed.error)
              if (parsed.token) {
                aiMsg.content += parsed.token
                setMessages([...newMessages])
              }
            } catch { /* skip malformed lines */ }
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        if (!aiMsg.content) {
          aiMsg.content = '⏹ 生成已停止'
        }
      } else {
        aiMsg.content = `⚠️ ${err.message}`
      }
      setMessages([...newMessages])
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function newChat() {
    setMessages([])
    setInput('')
    introducedRef.current = false
    if (abortRef.current) abortRef.current.abort()
    setLoading(false)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg, color: colors.text, fontFamily: '-apple-system, sans-serif',
      transition: 'background 0.3s, color 0.3s'
    }}>
      {/* 右上角日期 */}
      <DateDisplay colors={colors} />

      {/* 主页面内容 */}
      <div style={{ padding: '40px 24px', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>欢迎</h1>
        <p style={{ fontSize: 15, color: colors.textMuted, lineHeight: 1.8 }}>
          这是示例页面内容。点击右下角的按钮打开 AI 对话助手。
        </p>
      </div>

      {/* 浮动按钮 */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: 28, right: 28, width: 52, height: 52,
          borderRadius: '50%', border: 'none',
          background: colors.fabBg, color: '#fff',
          fontSize: 24, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
          transition: 'background 0.2s, transform 0.2s',
          zIndex: 999,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = colors.fabHover; e.currentTarget.style.transform = 'scale(1.08)' }}
        onMouseLeave={e => { e.currentTarget.style.background = colors.fabBg; e.currentTarget.style.transform = 'scale(1)' }}
        title="打开 AI 对话"
      >
        💬
      </button>

      {/* 遮罩层 */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: colors.overlay,
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* 对话弹框 */}
      {open && (
        <div style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(520px, 90vw)',
          height: 'min(620px, 80vh)',
          display: 'flex', flexDirection: 'column',
          background: colors.bg,
          borderRadius: 16,
          boxShadow: colors.shadow,
          border: `1px solid ${colors.border}`,
          zIndex: 1001,
          overflow: 'hidden',
          animation: 'scaleIn 0.2s ease',
        }}>
          {/* 弹框头部 */}
          <header style={{
            padding: '10px 16px',
            borderBottom: `1px solid ${colors.headerBorder}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexShrink: 0,
          }}>
            <h1 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>AI 智能对话</h1>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <ThemeToggle theme={theme} toggle={toggle} colors={colors} />
              <button onClick={newChat} style={{
                padding: '4px 12px', borderRadius: 6, border: `1px solid ${colors.border}`,
                background: 'transparent', color: colors.textMuted, cursor: 'pointer', fontSize: 12
              }}>
                新对话
              </button>
              <button
                onClick={() => setOpen(false)}
                title="关闭"
                style={{
                  width: 30, height: 30, borderRadius: 6,
                  border: `1px solid ${colors.border}`,
                  background: 'transparent', color: colors.textMuted,
                  cursor: 'pointer', fontSize: 16, display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
          </header>

          {/* 消息区域 */}
          <main style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} colors={colors} />)}
            {loading && !messages[messages.length - 1]?.content && <TypingIndicator colors={colors} />}
            <div ref={messagesEndRef} />
          </main>

          {/* 输入区域 */}
          <footer style={{
            padding: '10px 16px',
            borderTop: `1px solid ${colors.footerBorder}`,
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入你的问题..."
                disabled={loading}
                rows={1}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: 10,
                  background: colors.inputBg, border: `1px solid ${colors.inputBorder}`,
                  color: colors.inputText, fontSize: 13, resize: 'none',
                  outline: 'none', fontFamily: 'inherit',
                  transition: 'background 0.3s, border-color 0.3s, color 0.3s'
                }}
              />
              {loading ? (
                <button
                  onClick={() => abortRef.current?.abort()}
                  style={{
                    padding: '8px 16px', borderRadius: 10,
                    background: '#ef4444', color: '#fff', border: 'none',
                    cursor: 'pointer',
                    fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <span style={{ lineHeight: 1 }}>■</span> 停止
                </button>
              ) : (
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  style={{
                    padding: '8px 16px', borderRadius: 10,
                    background: !input.trim() ? colors.primaryDisabled : colors.primary,
                    color: colors.sendBtn, border: 'none',
                    cursor: !input.trim() ? 'not-allowed' : 'pointer',
                    fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
                    transition: 'background 0.3s'
                  }}
                >
                  发送
                </button>
              )}
            </div>
          </footer>
        </div>
      )}

      {/* 动画关键帧 */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: translate(-50%, -50%) scale(0.95) } to { opacity: 1; transform: translate(-50%, -50%) scale(1) } }
      `}</style>
    </div>
  )
}
