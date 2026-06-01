## Why

用户打开 AI 对话弹框时，当前只显示静态欢迎文案（"👋 欢迎使用 AI 对话"），缺乏互动感。需要在弹框打开时自动发送一条自我介绍消息到聊天界面，让用户立即感受到 AI 的存在感和能力，引导用户开始对话。

## What Changes

- 弹框首次打开时，自动在消息列表中插入一条 AI 自我介绍消息
- 自我介绍消息以 AI 消息气泡样式展示，包含 Markdown 格式
- 仅在首次打开时发送，后续关闭再打开不重复发送
- 移除现有的静态欢迎文案，改为由动态自我介绍消息替代

## Capabilities

### New Capabilities

（无新增能力）

### Modified Capabilities

- `ai-chat`: 修改 Chat UI Layout 场景，弹框首次打开时自动显示 AI 自我介绍消息替代静态欢迎文案

## Impact

- 前端代码：`src/frontend/src/App.jsx` — 新增 open 状态联动逻辑，首次打开时插入自我介绍消息
- 无后端变更（自我介绍消息为前端本地生成，不调用 AI API）
