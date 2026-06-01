## Context

当前 sendMessage 函数使用 fetch + ReadableStream 获取 AI 回复，但没有中止机制。输入区域在 loading 时禁用发送按钮，用户无法干预生成过程。

## Goals / Non-Goals

**Goals:**
- AI 生成过程中显示"停止"按钮替代"发送"按钮
- 点击停止后立即中断流式请求
- 保留已接收的部分内容

**Non-Goals:**
- 不支持暂停/恢复（只有完全停止）
- 不修改后端

## Decisions

- 使用 AbortController 中断 fetch 请求，已有 abortRef 但未实际使用
- 停止按钮替换发送按钮的位置，保持 UI 一致性
- 停止后自动将 loading 置为 false，恢复输入状态

## Risks / Trade-offs

- 中断时 AI 消息可能只显示部分内容，但这是用户主动行为，可接受
