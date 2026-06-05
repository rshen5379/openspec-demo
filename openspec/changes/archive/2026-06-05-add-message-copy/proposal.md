# Proposal: Add Message Copy

## Why

当前对话中，用户无法快速复制消息内容。AI 回复中虽然有代码块复制功能，但普通文本消息（包括用户消息和 AI 消息）缺少一键复制能力。用户需要手动选中文字再复制，体验不够流畅。

## What Changes

- 为用户消息气泡和 AI 消息气泡添加点击复制功能
- 点击消息后，将消息的纯文本内容复制到剪贴板
- 显示一个短暂的视觉反馈（如 tooltip/浮动文字"已复制"），1.5 秒后自动消失
- 鼠标悬停时显示提示光标（cursor: pointer），暗示可点击

## Impact

- **Specs**: `ai-chat` — 新增 Message Copy Requirement
- **Code**: `src/frontend/src/App.jsx` — 修改 `MessageBubble` 组件，添加 copy 状态和 toast 反馈
- **API**: 无变更
- **User**: 用户可一键复制任意消息内容，提升交互效率
