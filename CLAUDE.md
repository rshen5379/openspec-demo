# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

<!-- TODO: 替换为你的项目描述 -->
AI 对话应用示例项目，使用 OpenSpec 工作流管理变更。前端 React + Vite，后端 Express + OpenAI SDK，通过 SSE 实现流式响应。

## 强制规则（AGENTS.md）

**所有代码修改必须遵循 OpenSpec 工作流**，除非属于例外情况（纯文档、紧急热修复、用户明确跳过）。

流程：`/openspec-proposal-creation` → 用户批准 → `/openspec-implementation` → `/openspec-archiving`

禁止使用 `/opsx:*` 旧指令，必须使用 `/openspec-*` 技能。

tasks.md 格式：分组用 `## N. 标题`，任务项用 `- [ ] N.M 描述` checkbox，最后必须是验证分组。

## 开发命令

<!-- TODO: 替换为你的项目命令 -->
```bash
# 安装所有依赖
npm run install:all

# 启动开发（前端 :5173 + 后端 :3001）
npm run dev

# 仅启动后端
npm run dev:backend

# 仅启动前端
npm run dev:frontend

# 初始化技能和 Agent 目录
npm run setup:skills

# 前端构建
cd src/frontend && npm run build
```

## 架构

<!-- TODO: 替换为你的项目架构描述 -->
**单组件 SPA**：整个前端应用在 `src/frontend/src/App.jsx` 中，无路由、无状态管理库。所有 UI 组件（Avatar、MessageBubble、TypingIndicator、ThemeToggle、DateDisplay）定义在同一文件中，使用内联样式。

**主题系统**：`themes.js` 定义 dark/light 两套颜色对象，`useTheme.js` 通过 localStorage 持久化选择，默认跟随系统偏好。

**后端 API**：
- `src/backend/server.js` — Express 服务器，唯一的 API 端点 `POST /api/chat` 返回 SSE 流
- `src/backend/ai-service.js` — 封装 OpenAI SDK，`streamChat()` 是 async generator 逐 token 输出
- 前端通过 Vite proxy（`vite.config.js`）将 `/api` 请求代理到后端

**数据持久化**：纯 localStorage，无数据库。聊天历史 key 为 `ai-chat-messages`，主题 key 为 `ai-chat-theme`。

**环境变量**：`.env` 文件配置 `OPENAI_API_KEY`、`OPENAI_BASE_URL`、`OPENAI_MODEL`、`PORT`（默认 3001）。

## OpenSpec 结构

```
openspec/
├── config.yaml       # OpenSpec 配置（项目上下文）
├── specs/            # 活规格文档（需求真相源）
└── changes/          # 进行中的变更提案
    └── archive/      # 已归档变更（spec-delta 已合并到 specs/）
```

规格文档使用 Given/When/Then 场景格式描述需求。

## 本地技能

| 技能 | 触发词 | 用途 |
|------|--------|------|
| `dev-verify` | "看看效果"、"验证改动" | 启动 dev server + Playwright 检查页面 |
| `quick-fix` | "快速修复"、"hotfix" | 精简 OpenSpec 流程定位修复 bug |
| `test-gen` | "生成测试" | 自动生成 Vitest 测试 |
| `setup-skills` | "初始化技能"、"链接技能" | 安装依赖、创建 symlink |

## 代码修改定位参考

<!-- TODO: 替换为你的项目文件定位表 -->
| 问题类型 | 关键文件 |
|----------|----------|
| UI 样式/布局 | `App.jsx` + `themes.js` |
| 对话逻辑/流式 | `App.jsx` + `server.js` |
| 主题切换 | `useTheme.js` + `themes.js` |
| AI 服务/API | `ai-service.js` + `server.js` |
| 日期时钟 | `App.jsx`（DateDisplay 组件） |
