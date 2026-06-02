# OpenSpec Demo

基于 OpenSpec 工作流的 AI 对话应用示例项目。

## 快速开始

**前置条件**：Node.js 18+

```bash
npm run install:all       # 安装前后端依赖
```

然后对 Agent 说 **"初始化技能"**，会自动安装外部技能（skillfish）、初始化 Agent 目录并创建本地技能（skills）的symlink。



## 技能管理

对 Agent 说以下触发词即可：

| 操作 | 触发词 |
|------|--------|
| 初始化 / 创建链接 | "链接技能" |
| 查看状态 | "链接技能状态" |
| 移除技能 | "移除技能 \<名称\>" |


## 启动开发服务

对 Agent 说 **"看看效果"**或执行/dev-revify指令，会自动启动 dev server 并检查页面状态。
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
