## Context

当前聊天界面使用硬编码深色主题颜色。需要引入主题系统，支持 light/dark 两套配色，用户可手动切换且选择会被持久化。

## Goals / Non-Goals

**Goals:**
- 支持深色/浅色两套主题，切换即时生效
- 默认跟随系统偏好（prefers-color-scheme）
- 用户选择持久化到 localStorage
- 所有 UI 组件颜色通过主题变量获取

**Non-Goals:**
- 不支持自定义主题或超过 2 套主题
- 不涉及后端 API 变更

## Decisions

- 抽取 `themes.js` 定义两套颜色变量（bg、text、border、bubble 等）
- 使用 `useTheme` Hook 封装主题状态管理，包含 localStorage 读写和系统偏好监听
- ThemeToggle 组件放置在对话框 header 右侧，使用 ☀️/🌙 图标

## Risks / Trade-offs

- 新增两个文件但结构清晰，维护成本低
