# Proposal: Add Message Regenerate

## Why

当前 AI 对话中，用户对 AI 回复不满意时只能重新发送一条新消息。缺少直接"重新生成"的能力，导致不满意的内容残留在对话历史中，影响后续上下文质量和用户体验。

## What Changes

- 为每条 AI 消息添加"重新生成"按钮（图标：🔄），仅在 hover 时显示
- 点击后删除当前 AI 回复，使用相同的对话上下文重新请求 AI
- 重新生成期间显示 loading 状态，发送按钮变为"停止"按钮
- 重新生成完成后新回复替换旧回复，对话历史同步更新到 localStorage
- 不影响现有的消息点击复制功能

## Impact

- **Specs**: `ai-chat` — 新增 Message Regeneration Requirement
- **Code**: `src/frontend/src/App.jsx` — 修改 `MessageBubble` 组件，新增 regenerate 按钮；修改 `App` 组件，新增 `regenerateMessage` 函数
- **API**: 无变更（复用现有 `/api/chat` 接口）
- **User**: 用户可一键重新生成不满意的 AI 回复，无需手动重述问题
