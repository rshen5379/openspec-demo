## Why

当前聊天界面使用硬编码的深色主题，用户无法根据环境光线或个人偏好切换到浅色模式。提供主题切换功能可以提升用户体验，特别是在日间/夜间不同环境下使用时减少视觉疲劳。

## What Changes

- 新增主题切换按钮（太阳/月亮图标），位于顶部栏右侧
- 新增主题定义系统（light / dark 两套颜色变量）
- 修改 Chat UI Layout，使所有颜色通过主题变量获取
- 使用 localStorage 持久化用户选择的主题
- 默认跟随系统 `prefers-color-scheme` 设置

## Capabilities

### New Capabilities

（无新增能力）

### Modified Capabilities

- `ai-chat`: 新增 Theme Toggle Control 和 Theme Persistence 需求，修改 Chat UI Layout 支持主题切换

## Impact

- 前端代码：`src/frontend/src/App.jsx` — 重构硬编码颜色为主题变量，添加切换逻辑
- 新增文件：`src/frontend/src/themes.js` — 主题颜色定义
- 新增文件：`src/frontend/src/useTheme.js` — 主题状态管理 Hook
- 无后端变更
