## Why

用户需要一个简洁直观的 AI 对话界面，能够以问答模式与 AI 实时交互。当前项目为空项目，需要从零构建完整的前后端应用，提供现代化的 Web 聊天体验。

## What Changes

- 新增前端单页应用（React + Vite），包含聊天对话框 UI
- 新增后端 API 服务（Node.js + Express），代理 AI 大模型调用
- 实现 SSE 流式响应，AI 回答逐 token 实时显示
- 支持多轮对话上下文（保留历史消息）
- 支持 Markdown 格式渲染和代码高亮
- 支持新建对话、自动滚动、错误提示等交互细节

## Capabilities

### New Capabilities
- `ai-chat`: 智能 AI 问答对话，包含消息收发、流式响应、多轮上下文、Markdown 渲染和聊天 UI

### Modified Capabilities

（无已有能力需要修改）

## Impact

- 前端代码：`src/frontend/` — React + Vite 应用
- 后端代码：`src/backend/` — Node.js + Express API 服务
- API：新增 `POST /api/chat`（SSE 流式响应）
- 依赖：OpenAI 兼容 API 密钥（环境变量配置）
