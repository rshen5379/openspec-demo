## Why

当前聊天消息没有时间信息，无法判断每条消息的发送时间，降低对话的可追溯性。

## What Changes

- 每条消息气泡下方显示发送时间（HH:mm 格式）
- 时间戳随消息一起持久化到 localStorage
- 样式：小字号、浅色文字，不影响阅读体验

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `ai-chat`: Message Display 中消息气泡增加时间戳显示

## Impact

- 前端：修改 `src/frontend/src/App.jsx` 中消息数据结构和 MessageBubble 组件
- 无后端变更
