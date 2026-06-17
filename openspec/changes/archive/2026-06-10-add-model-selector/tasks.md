# Implementation Tasks

## 1. 后端配置

- [ ] 1.1 在 `.env` 中新增 `AVAILABLE_MODELS` 配置项，格式为逗号分隔的模型 ID 列表
- [ ] 1.2 修改 `ai-service.js`，`streamChat` 接受可选 `model` 参数，未传时使用默认模型

## 2. 后端 API

- [ ] 2.1 新增 `GET /api/models` 端点，返回可用模型列表（解析 `AVAILABLE_MODELS` 环境变量）
- [ ] 2.2 修改 `POST /api/chat`，接受请求体中的 `model` 字段并传递给 `streamChat`

## 3. 前端 UI

- [ ] 3.1 在 `themes.js` 两套主题中添加模型选择器相关颜色 token
- [ ] 3.2 在 App.jsx 中添加 `ModelSelector` 组件（下拉选择框）
- [ ] 3.3 在 SessionSidebar 底部放置 ModelSelector，切换模型时更新当前会话的 model 字段
- [ ] 3.4 `sendMessage` 函数发送请求时附带当前会话的 model 参数

## 4. 持久化与兼容

- [ ] 4.1 会话数据结构增加 `model` 字段，新建会话时使用上次选择的模型
- [ ] 4.2 应用启动时调用 `GET /api/models` 获取可用模型列表，缓存到状态
- [ ] 4.3 若会话中的 model 不在可用列表中，回退到默认模型

## 5. 验证

- [ ] 5.1 启动 dev server，验证模型列表正确加载
- [ ] 5.2 验证切换模型后发送消息使用正确的模型
- [ ] 5.3 验证模型选择随会话持久化，刷新后恢复
- [ ] 5.4 验证新建会话继承上次模型选择
- [ ] 5.5 验证不传 model 时使用默认模型的向后兼容性
