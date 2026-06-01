## Why

当前刷新页面后所有对话消息丢失，用户需要重新开始对话。持久化聊天历史可以保留上下文，提升用户体验，特别是长时间使用场景下避免重要对话丢失。

## What Changes

- 使用 localStorage 存储聊天消息历史
- 页面加载时自动恢复上次的对话记录
- "新对话"按钮清空历史时同步清除 localStorage
- 对话框打开时不再强制显示欢迎消息，仅首次使用时显示

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `ai-chat`: Multi-turn Conversation Context 新增持久化行为，Chat UI Layout 调整首次打开逻辑

## Impact

- 前端：修改 `src/frontend/src/App.jsx` 中 messages 状态的初始化和持久化逻辑
- 新增 localStorage 读写操作
- 无后端变更
