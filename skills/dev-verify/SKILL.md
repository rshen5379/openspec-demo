# dev-verify

**触发词**："验证改动"、"检查页面"、"看看效果"、"dev verify"

启动 dev server → 截图 → 检查控制台错误 → 输出验证报告。

## 流程

1. **检查依赖**: 确认 `src/frontend/node_modules` 和 `src/backend/node_modules` 存在，缺失则运行 `npm run install:all`
2. **启动服务**: 后台运行 `npm run dev`（前端 `http://localhost:5173`，后端端口见 `src/backend/server.js`）
3. **打开页面**: 用 Playwright 访问 `http://localhost:5173`，等待 "欢迎" 文本出现（最多重试 3 次）
4. **截图主页**: 保存 `verify-main-page.png`
5. **测试 Dialog**: 点击 💬 浮动按钮 → 等待 "AI 智能对话" 出现 → 截图 `verify-dialog-open.png`
6. **检查控制台**: 获取 console error，列出所有错误
7. **输出报告**: 页面状态 / Dialog 状态 / 控制台错误 / 截图路径 / 修复建议

## 注意事项

- 不自动关闭 dev server
- 如果端口已被占用则跳过启动步骤
