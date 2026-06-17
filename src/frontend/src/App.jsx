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

// --- 多会话数据层 ---

const SESSIONS_KEY = 'ai-chat-sessions'
const LEGACY_KEY = 'ai-chat-messages'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function createSession(defaultModel) {
  return {
    id: generateId(),
    title: '新对话',
    messages: [],
    model: defaultModel || '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

function loadSessions() {
  try {
    // 迁移旧数据
    if (!localStorage.getItem(SESSIONS_KEY) && localStorage.getItem(LEGACY_KEY)) {
      const raw = localStorage.getItem(LEGACY_KEY)
      const msgs = raw ? JSON.parse(raw) : []
      const session = {
        id: generateId(),
        title: msgs.length > 0 ? '迁移的对话' : '新对话',
        messages: msgs,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      const data = { sessions: [session], activeSessionId: session.id }
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(data))
      localStorage.removeItem(LEGACY_KEY)
      return data
    }
    const raw = localStorage.getItem(SESSIONS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  const session = createSession()
  return { sessions: [session], activeSessionId: session.id }
}

function saveSessions(data) {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

// --- 组件 ---

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

// --- 侧边栏 ---

function relativeTime(ts) {
  const diff = Date.now() - ts
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + ' 分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前'
  return Math.floor(diff / 86400000) + ' 天前'
}

function SessionItem({ session, isActive, colors, onSelect, onDelete, onRename }) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(session.title)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  function confirmRename() {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== session.title) {
      onRename(session.id, trimmed)
    } else {
      setEditTitle(session.title)
    }
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); confirmRename() }
    if (e.key === 'Escape') { setEditTitle(session.title); setEditing(false) }
  }

  return (
    <div
      onClick={() => !editing && onSelect(session.id)}
      onDoubleClick={() => { setEditing(true); setEditTitle(session.title) }}
      style={{
        padding: '8px 10px',
        borderRadius: 8,
        cursor: editing ? 'text' : 'pointer',
        background: isActive ? colors.sidebarActiveBg : colors.sidebarItemBg,
        color: isActive ? colors.sidebarActiveText : colors.textMuted,
        marginBottom: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4,
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = colors.sidebarItemHover }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = colors.sidebarItemBg }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <input
            ref={inputRef}
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={confirmRename}
            onKeyDown={handleKeyDown}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              background: colors.inputBg,
              border: `1px solid ${colors.primary}`,
              borderRadius: 4,
              padding: '2px 6px',
              color: colors.text,
              fontSize: 12,
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        ) : (
          <>
            <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {session.title}
            </div>
            <div style={{ fontSize: 10, color: colors.textDim, marginTop: 2 }}>
              {relativeTime(session.updatedAt)}
            </div>
          </>
        )}
      </div>
      {!editing && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(session.id) }}
          title="删除"
          style={{
            background: 'transparent',
            border: 'none',
            color: colors.textDim,
            cursor: 'pointer',
            fontSize: 14,
            padding: '2px 4px',
            borderRadius: 4,
            lineHeight: 1,
            display: 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ef4444' }}
          onMouseLeave={e => { e.currentTarget.style.color = colors.textDim }}
          className="session-delete-btn"
        />
      )}
    </div>
  )
}

function ModelSelector({ models, selectedModel, onChange, colors }) {
  if (!models || models.length <= 1) return null
  return (
    <select
      value={selectedModel || ''}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', padding: '6px 8px', borderRadius: 6,
        border: `1px solid ${colors.selectorBorder}`,
        background: colors.selectorBg, color: colors.selectorText,
        fontSize: 12, cursor: 'pointer', outline: 'none',
      }}
    >
      {models.map(m => (
        <option key={m.id} value={m.id}>{m.name}</option>
      ))}
    </select>
  )
}

function SessionSidebar({ sessions, activeId, collapsed, colors, onSelect, onCreate, onDelete, onRename, onToggle, models, activeModel, onModelChange }) {
  const sorted = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt)
  return (
    <div style={{
      width: collapsed ? 40 : 200,
      minWidth: collapsed ? 40 : 200,
      background: colors.sidebarBg,
      borderRight: `1px solid ${colors.sidebarBorder}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'width 0.2s, min-width 0.2s',
      flexShrink: 0,
    }}>
      {/* 侧边栏头部 */}
      <div style={{ padding: '10px 8px', borderBottom: `1px solid ${colors.sidebarBorder}`, display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          onClick={onToggle}
          title={collapsed ? '展开侧边栏' : '收起侧边栏'}
          style={{
            width: 26, height: 26, borderRadius: 6,
            border: `1px solid ${colors.sidebarBorder}`,
            background: 'transparent', color: colors.textMuted,
            cursor: 'pointer', fontSize: 14, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          {collapsed ? '›' : '‹'}
        </button>
        {!collapsed && (
          <button
            onClick={onCreate}
            style={{
              flex: 1, padding: '4px 8px', borderRadius: 6,
              border: `1px solid ${colors.border}`,
              background: 'transparent', color: colors.textMuted,
              cursor: 'pointer', fontSize: 12,
            }}
          >
            + 新建对话
          </button>
        )}
      </div>
      {/* 会话列表 */}
      {!collapsed && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 6px' }}>
          {sorted.map(s => (
            <div key={s.id} style={{ position: 'relative' }}
              onMouseEnter={e => { const btn = e.currentTarget.querySelector('.session-delete-btn'); if (btn) btn.style.display = 'block' }}
              onMouseLeave={e => { const btn = e.currentTarget.querySelector('.session-delete-btn'); if (btn) btn.style.display = 'none' }}
            >
              <SessionItem
                session={s}
                isActive={s.id === activeId}
                colors={colors}
                onSelect={onSelect}
                onDelete={onDelete}
                onRename={onRename}
              />
            </div>
          ))}
        </div>
      )}
      {/* 模型选择器 */}
      {!collapsed && (
        <div style={{ padding: '8px 8px', borderTop: `1px solid ${colors.sidebarBorder}`, flexShrink: 0 }}>
          <ModelSelector
            models={models}
            selectedModel={activeModel}
            onChange={onModelChange}
            colors={colors}
          />
        </div>
      )}
    </div>
  )
}

// --- 主应用 ---

export default function App() {
  const { theme, colors, toggle } = useTheme()
  const [sessionData, setSessionData] = useState(() => loadSessions())
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [models, setModels] = useState([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return window.innerWidth < 640
  })
  const introducedRef = useRef(false)
  const messagesEndRef = useRef(null)
  const abortRef = useRef(null)

  const activeSession = sessionData.sessions.find(s => s.id === sessionData.activeSessionId) || sessionData.sessions[0]
  const messages = activeSession?.messages || []

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    saveSessions(sessionData)
  }, [sessionData])

  useEffect(() => {
    fetch('/api/models').then(r => r.json()).then(setModels).catch(() => {})
  }, [])

  useEffect(() => {
    if (!open) return
    if (!introducedRef.current) {
      introducedRef.current = true
      if (messages.length === 0 && activeSession) {
        setSessionData(prev => ({
          ...prev,
          sessions: prev.sessions.map(s =>
            s.id === prev.activeSessionId
              ? { ...s, messages: [INTRO_MESSAGE] }
              : s
          ),
        }))
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

  function updateSession(sessionId, updater) {
    setSessionData(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => s.id === sessionId ? updater(s) : s),
    }))
  }

  function handleCreateSession() {
    const lastModel = activeSession?.model || models[0]?.id || ''
    const session = createSession(lastModel)
    setSessionData(prev => {
      const next = {
        sessions: [...prev.sessions, session],
        activeSessionId: session.id,
      }
      // 新会话加入欢迎消息
      session.messages = [INTRO_MESSAGE]
      introducedRef.current = true
      return next
    })
    setInput('')
    if (abortRef.current) { abortRef.current.abort(); abortRef.current = null }
    setLoading(false)
  }

  function handleSelectSession(id) {
    if (id === sessionData.activeSessionId) return
    if (abortRef.current) { abortRef.current.abort(); abortRef.current = null }
    setLoading(false)
    setInput('')
    setSessionData(prev => ({ ...prev, activeSessionId: id }))
    introducedRef.current = true
  }

  function handleDeleteSession(id) {
    setSessionData(prev => {
      const remaining = prev.sessions.filter(s => s.id !== id)
      if (remaining.length === 0) {
        const lastModel = prev.sessions.find(s => s.id === id)?.model || models[0]?.id || ''
        const session = createSession(lastModel)
        return { sessions: [session], activeSessionId: session.id }
      }
      const activeId = prev.activeSessionId === id
        ? remaining.reduce((a, b) => a.updatedAt > b.updatedAt ? a : b).id
        : prev.activeSessionId
      return { sessions: remaining, activeSessionId: activeId }
    })
  }

  function handleRenameSession(id, newTitle) {
    updateSession(id, s => ({ ...s, title: newTitle }))
  }

  function handleModelChange(modelId) {
    if (!activeSession) return
    updateSession(activeSession.id, s => ({ ...s, model: modelId, updatedAt: Date.now() }))
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading || !activeSession) return

    setInput('')
    setLoading(true)

    const userMsg = { role: 'user', content: text }
    const aiMsg = { role: 'assistant', content: '' }

    const currentId = activeSession.id
    setSessionData(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => {
        if (s.id !== currentId) return s
        const isFirstUserMsg = !s.messages.some(m => m.role === 'user')
        return {
          ...s,
          messages: [...s.messages, userMsg, aiMsg],
          title: isFirstUserMsg
            ? (text.length > 20 ? text.slice(0, 20) + '...' : text)
            : s.title,
          updatedAt: Date.now(),
        }
      }),
    }))

    // 获取发送前的消息列表用于 API 请求
    const apiMessages = [...messages, userMsg].map(m => ({
      role: m.role, content: m.content
    }))

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, model: activeSession.model || undefined }),
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
                // 触发重新渲染
                setSessionData(prev => ({
                  ...prev,
                  sessions: prev.sessions.map(s =>
                    s.id === currentId
                      ? { ...s, messages: [...s.messages.slice(0, -1), { ...aiMsg }], updatedAt: Date.now() }
                      : s
                  ),
                }))
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
      setSessionData(prev => ({
        ...prev,
        sessions: prev.sessions.map(s =>
          s.id === currentId
            ? { ...s, messages: [...s.messages.slice(0, -1), { ...aiMsg }] }
            : s
        ),
      }))
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
          width: 'min(720px, 90vw)',
          height: 'min(620px, 80vh)',
          display: 'flex', flexDirection: 'row',
          background: colors.bg,
          borderRadius: 16,
          boxShadow: colors.shadow,
          border: `1px solid ${colors.border}`,
          zIndex: 1001,
          overflow: 'hidden',
          animation: 'scaleIn 0.2s ease',
        }}>
          {/* 侧边栏 */}
          <SessionSidebar
            sessions={sessionData.sessions}
            activeId={sessionData.activeSessionId}
            collapsed={sidebarCollapsed}
            colors={colors}
            onSelect={handleSelectSession}
            onCreate={handleCreateSession}
            onDelete={handleDeleteSession}
            onRename={handleRenameSession}
            onToggle={() => setSidebarCollapsed(c => !c)}
            models={models}
            activeModel={activeSession?.model || models[0]?.id || ''}
            onModelChange={handleModelChange}
          />

          {/* 聊天区 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* 头部 */}
            <header style={{
              padding: '10px 16px',
              borderBottom: `1px solid ${colors.headerBorder}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexShrink: 0,
            }}>
              <h1 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>AI 智能对话</h1>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <ThemeToggle theme={theme} toggle={toggle} colors={colors} />
                <button onClick={handleCreateSession} style={{
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
