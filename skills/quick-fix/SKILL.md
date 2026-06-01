# quick-fix

**触发词**："快速修复"、"quick fix"、"小 bug"、"hotfix"

简化 OpenSpec 流程，自动定位 Bug 并生成精简提案。

## 流程

1. **接收描述**: 如描述不清，追问预期行为 vs 实际行为
2. **定位代码**: 按问题类型搜索
   - UI 样式 → `App.jsx` + `themes.js`
   - 对话逻辑 → `App.jsx`
   - 主题 → `useTheme.js`
   - AI 服务 → `ai-service.js`
3. **生成精简提案**: 在 `openspec/changes/fix-{描述}/` 下创建
   - `proposal.md`（问题→方案→影响）
   - `tasks.md`（2-5 个任务）
   - 受影响的 spec delta
4. **等待确认**: 输出问题 + 方案 + 改动文件列表，用户确认后才继续
5. **实施**: 按 tasks.md 最小改动修复
6. **验证**: 执行 `dev-verify` 流程确认效果
7. **归档**: 使用 `/openspec-archiving` 归档

## 原则

- 只修复问题本身，不做额外重构
