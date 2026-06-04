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

### Skillfish 命令参考

| 命令 | 说明 |
|------|------|
| `skillfish add <repo>/<skill-path>` | 从 GitHub 仓库安装技能到项目 |
| `skillfish install --project -y` | 根据 `skillfish.json` 清单安装所有已声明技能 |
| `skillfish bundle --project` | 扫描已安装技能，更新 `skillfish.json` 清单 |
| `skillfish bundle --global` | 扫描全局已安装技能，更新 `~/skillfish.json` |
| `skillfish list` | 列出所有 Agent 中已安装的技能 |
| `skillfish remove <skill>` | 移除已安装的技能 |
| `skillfish update` | 检查并更新已安装的技能 |
| `skillfish search <query>` | 在注册表中搜索技能 |

> **`install` vs `bundle`**：`install` 从 JSON 读 → 写磁盘（拉取），`bundle` 从磁盘读 → 写 JSON（快照）。手动 `add` 技能后运行 `bundle` 即可同步清单。

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
