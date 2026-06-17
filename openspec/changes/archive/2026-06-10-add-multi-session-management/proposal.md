# Proposal: 多会话管理

## Why

当前应用只支持单个对话，点击"新对话"会清除所有历史记录。用户无法同时维护多个话题，也无法回顾之前的对话内容。多会话管理是 AI 对话应用的基本期望功能。

## What Changes

- 在模态对话框左侧添加会话列表侧边栏
- 支持新建、切换、删除、重命名对话
- 自动从用户首条消息生成对话标题（截取前 20 字符）
- 所有会话数据持久化到 localStorage
- 自动迁移旧版 `ai-chat-messages` 格式到新的多会话结构
- 模态对话框宽度从 520px 扩展到 720px 以容纳侧边栏
- 侧边栏可收起/展开，适配小屏设备

## Impact

- **规格变更**: 新增 `multi-session-management` capability；修改 `ai-chat` 中的 Chat UI Layout、Chat History Persistence、Multi-turn Conversation Context 等需求
- **代码变更**: `App.jsx`（主要改动）、`themes.js`（新增侧边栏颜色 token）
- **数据迁移**: 旧 `ai-chat-messages` 自动迁移到新格式，向后兼容
- **用户体验**: 用户首次使用时无感知迁移，新会话列表默认展示
