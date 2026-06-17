# Proposal: Add Model Selector

## Why
当前 AI 模型（`OPENAI_MODEL`）通过 `.env` 写死在后端，用户无法在前端选择不同模型。不同场景（快速问答 vs 深度分析）需要不同能力的模型，用户应能按会话灵活切换。

## What Changes
- 后端 `.env` 新增 `AVAILABLE_MODELS` 配置项，定义可选模型列表
- 后端新增 `GET /api/models` 端点，返回可选模型列表
- 后端 `POST /api/chat` 支持接收 `model` 参数，动态选择模型
- 前端 SessionSidebar 底部新增模型选择下拉框
- 模型选择按会话级别持久化到 localStorage（session 数据增加 `model` 字段）
- 新会话使用上次选择的模型作为默认值

## Impact
- **规格影响**：新增 Model Selection capability；修改 AI Streaming Response（支持 model 参数）、Multi-turn Conversation Context（按会话隔离模型）、Chat History Persistence（session 包含 model）
- **代码影响**：`ai-service.js`（多模型支持）、`server.js`（新端点 + model 参数）、`App.jsx`（UI 选择器 + 持久化）、`.env`（新配置）
- **API 影响**：新增 `GET /api/models`；`POST /api/chat` 新增可选 `model` 字段
- **向后兼容**：不传 model 时使用 `.env` 中的 `OPENAI_MODEL` 作为默认值，完全向后兼容
