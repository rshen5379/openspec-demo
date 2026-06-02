# OpenSpec Demo

基于 OpenSpec 工作流的 AI 对话应用示例项目。

## 快速开始

**前置条件**：Node.js 18+

对 Agent 说 **"初始化技能"**，会自动安装依赖、外部技能、初始化 Agent 目录并创建 symlink。

对 Agent 说 **"看看效果"**，会自动启动 dev server 并检查页面状态。

## 技能管理

| 操作 | 触发词 |
|------|--------|
| 初始化 / 创建链接 | "链接技能" |
| 查看状态 | "链接技能状态" |
| 移除技能 | "移除技能 \<名称\>" |

## 项目结构

```
src/
├── frontend/          # React + Vite 前端
└── backend/           # Express 后端
openspec/
├── changes/           # 变更提案（进行中）
│   └── archive/       # 已归档的变更
└── specs/             # 活规格文档
skills/                # 本地技能
```
