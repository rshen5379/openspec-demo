# test-gen

**触发词**："生成测试"、"写测试"、"添加测试"、"test gen"

扫描 React 组件并自动生成 Vitest 测试用例。

## 流程

1. **检查基础设施**: 检查 `src/frontend/package.json` 是否有 `vitest` 和 `@testing-library/react`
2. **安装依赖（如缺失）**: 在 `src/frontend/` 下执行
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
   ```
3. **创建配置（如缺失）**:
   - `src/frontend/vitest.config.js`（environment: 'jsdom'）
   - `src/frontend/test-setup.js`（导入 jest-dom）
   - package.json 添加 `test` script
4. **扫描组件**: 读取 `src/frontend/src/` 下的组件文件，分析导出、props、行为
5. **生成测试**: 为每个组件在 `src/frontend/src/__tests__/` 下生成测试，覆盖渲染、交互、状态变化
6. **运行测试**: `cd src/frontend && npm test`
7. **修复失败**: 调整测试（不改源码），直到全部通过
8. **输出报告**: 新增文件列表 + 测试结果 + 覆盖的组件表

## 原则

- 测试不改源码
- 优先测用户可见行为
- Mock 最小化
- 每个测试独立
