# dev-verify

**触发词**："验证改动"、"检查页面"、"看看效果"、"dev verify"

启动 dev server → 打开页面 → 检查控制台错误 → 输出验证报告。

## 流程

1. **检查依赖**: 确认 `src/frontend/node_modules` 和 `src/backend/node_modules` 存在，缺失则运行 `npm run install:all`
2. **启动服务**: 后台运行 `npm run dev`（前端 `http://localhost:5173`，后端端口见 `src/backend/server.js`）
3. **打开页面**: 用 Playwright 访问 `http://localhost:5173`，等待 "欢迎" 文本出现（最多重试 3 次）
4. **检查控制台**: 获取 console error，列出所有错误
5. **输出报告**: 页面状态 / 控制台错误 / 修复建议

## 端口占用处理

启动前先用 `Invoke-WebRequest` 请求 `http://localhost:5173`：
- **返回 200**：服务已在运行，跳过启动，直接用 Playwright 打开页面
- **连接失败**：端口空闲，执行 `npm run dev` 启动服务，等待几秒后重试直到页面可达（最多重试 3 次，每次间隔 2 秒）

## 注意事项

- 不自动关闭 dev server
- 不截图、不测试 Dialog
