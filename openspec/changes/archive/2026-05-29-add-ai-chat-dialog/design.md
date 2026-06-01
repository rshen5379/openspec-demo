## Context

当前项目为空项目，需从零搭建智能 AI 对话应用。目标是一个简洁的问答式聊天界面：用户输入问题，AI 流式返回回答。架构为经典的前后端分离模式。

## Goals / Non-Goals

**Goals:**
- 提供简洁直观的聊天 UI，支持一问一答的交互模式
- AI 回答通过 SSE 流式传输，逐 token 实时显示
- 支持多轮对话，AI 能理解上下文
- AI 回答支持 Markdown 渲染和代码高亮
- API Key 安全存储在后端，前端不暴露

**Non-Goals:**
- 不做用户认证/登录系统
- 不做对话历史持久化（刷新页面清空）
- 不做多模型切换
- 不做文件上传/图片理解
- 不做移动端适配优化

## Decisions

### 1. 前端：React + Vite
- **选择**: React + Vite 单页应用
- **理由**: 生态成熟，组件化开发适合聊天 UI，Vite 开发体验好
- **替代方案**: Vue（同样可行，但 React 社区更大）、纯 HTML/JS（难以管理状态）

### 2. 后端：Node.js + Express + SSE
- **选择**: Express 作为 API 服务器，使用 Server-Sent Events (SSE) 推送流式响应
- **理由**: SSE 比 WebSocket 更简单，单向推送（服务器→客户端）足够；Express 轻量易用
- **替代方案**: WebSocket（过度设计，聊天场景不需要双向实时）、Fastify（稍复杂）

### 3. AI API：OpenAI 兼容接口
- **选择**: 使用 OpenAI SDK（`openai` npm 包），兼容多家模型提供商
- **理由**: 标准化接口，方便切换不同 AI 服务（OpenAI、DeepSeek、本地 Ollama 等）
- **配置**: 通过环境变量 `OPENAI_API_KEY`、`OPENAI_BASE_URL`、`OPENAI_MODEL` 配置

### 4. Markdown 渲染：marked + highlight.js
- **选择**: `marked` 解析 Markdown，`highlight.js` 代码高亮
- **理由**: 轻量、性能好、社区广泛使用

### 5. 前端状态管理：React useState
- **选择**: 直接使用 React useState 管理消息列表和输入状态
- **理由**: 聊天应用状态简单（消息数组 + 加载状态），不需要 Redux 等复杂状态管理

## Risks / Trade-offs

- AI API 延迟较高 → SSE 流式响应降低感知延迟，用户能实时看到生成过程
- API Key 安全性 → 后端代理调用，前端不接触密钥；`.env` 文件加入 `.gitignore`
- 对话历史仅存内存 → 刷新丢失，可接受（Non-Goal 不做持久化）
- 单组件可能变复杂 → 后续可按需拆分，初期保持简洁
