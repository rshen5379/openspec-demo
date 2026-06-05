# OpenSpec Demo

基于 [OpenSpec](https://github.com/forztf/open-skilled-sdd) 工作流的示例项目。演示如何搭建 **spec-driven development** 环境：技能安装、多 Agent symlink、规范化变更管理。

> 本项目自带一个 AI 对话应用作为"被管理的项目"，仅用于演示 OpenSpec 流程。

---

## 🚀 从模板创建你自己的项目

如果你是 **0→1** 的开发者，想用这个项目作为基座开始新项目，按以下步骤操作：

### 第一步：复制项目

```bash
# 方式 A：直接复制（保留 git 历史）
git clone <repo-url> my-project && cd my-project
git remote remove origin           # 移除原仓库关联

# 方式 B：复制时不保留历史（更干净）
# 直接复制整个目录，然后删除 .git/
rm -rf .git && git init
```

### 第二步：识别哪些文件属于"基座"、哪些属于"演示"

**保留（基座设施）**：
```
openspec/                  # OpenSpec 变更管理框架
├── config.yaml               ← 必须修改：填入你的项目上下文
├── specs/                    ← 保留目录结构，删除演示 spec
└── changes/
    └── archive/              ← 保留目录，删除演示归档（可选保留作参考）

skills/                    # 本地技能（全部保留）
AGENTS.md                  # 工作流强制规则（通用，不用改）
skillfish.json             # 外部技能清单（不用改）
package.json               # 保留根 package.json（scripts 通用）
.gitignore                 # 通用
```

**替换（演示业务代码）**：
```
src/                       # ← 删除或替换为你的代码
CLAUDE.md                  # ← 必须修改：替换项目描述、架构、命令
openspec/specs/            # ← 删除演示 spec，创建你自己的
openspec/changes/archive/  # ← 删除演示归档（可选保留作参考）
```

### 第三步：修改 3 个文件

**1. `openspec/config.yaml`** — 填入你的项目上下文：

```yaml
schema: spec-driven
context: |
  Tech stack: 你的技术栈
  Language: 编程语言
  Conventions: 你的编码规范
```

**2. `CLAUDE.md`** — 搜索所有 `<!-- TODO -->` 注释，替换为你的项目信息：
- 项目概述
- 开发命令
- 架构描述
- 代码修改定位参考表

**3. `openspec/specs/`** — 删除演示 spec，创建你的第一个 spec：
```bash
rm -rf openspec/specs/ai-chat openspec/specs/date-display
rm -rf openspec/changes/archive/*    # 可选：清空演示归档
```

### 第四步：初始化技能

```bash
npm run install:all                                    # 安装依赖
node skills/setup-skills/setup-skills.js --init        # 初始化 Agent 目录
skillfish install --project -y                         # 安装外部技能
node skills/setup-skills/setup-skills.js               # 创建 symlink
```

### 第五步：开始开发

对 Agent 说第一个需求，例如：*"我想添加用户登录功能"*，Agent 会自动触发 `/openspec-proposal-creation` 创建提案。

> 📖 详细指南见 [TEMPLATE_GUIDE.md](TEMPLATE_GUIDE.md)

---

## 技能体系总览

本项目有两类技能，通过 symlink 分发到多个 AI Agent 目录：

```
skills/                          ← 本地技能（项目自定义）
├── setup-skills/                   安装依赖 + 初始化 Agent + symlink
├── dev-verify/                     启动 dev server + Playwright 验证
├── quick-fix/                      精简 OpenSpec 流程修复 bug
└── test-gen/                       自动生成 Vitest 测试

.claude/skills/                  ← 外部技能（skillfish 从 GitHub 安装）
├── openspec-proposal-creation/     创建变更提案
├── openspec-implementation/        实施已批准的提案
├── openspec-archiving/             归档已完成的变更
└── openspec-context-loading/       加载项目上下文
```

### 多 Agent 分发

`setup-skills` 会为每个已检测的 Agent 目录创建 symlink，使同一套技能在所有 Agent 中可用：

```
.claude/skills/        ← Claude Code
.codex/skills/         ← OpenAI Codex CLI
.gemini/skills/        ← Gemini CLI
.codebuddy/skills/     ← CodeBuddy
```

Windows 使用 junction link（`mklink /J`），Unix 使用 symlink。需开启开发者模式。

---

## OpenSpec 工作流

所有代码修改 **必须** 遵循三步流程（由 `AGENTS.md` 强制约束）：

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  1. 创建提案     │ →  │  2. 实施任务      │ →  │  3. 归档变更     │
│  /openspec-      │    │  /openspec-       │    │  /openspec-      │
│  proposal-       │    │  implementation   │    │  archiving       │
│  creation        │    │                   │    │                  │
│                  │    │                   │    │                  │
│  产出:           │    │  产出:            │    │  产出:           │
│  · proposal.md   │    │  · 代码修改       │    │  · spec 合并     │
│  · tasks.md      │    │  · tasks [x]      │    │  · 移至 archive/ │
│  · spec-delta.md │    │                   │    │                  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        ↑ 批准后进入         ↑ 完成后进入
```

### 第一步：创建提案

触发词：`"openspec proposal"`、`"plan change"`、`"add feature"`

1. 在 `openspec/changes/{change-id}/` 下生成：
   - **proposal.md** — Why / What Changes / Impact
   - **tasks.md** — 编号 checkbox 任务列表，最后必须包含验证分组
   - **specs/{capability}/spec-delta.md** — ADDED / MODIFIED / REMOVED 需求（EARS 格式）
2. 等待用户批准

### 第二步：实施任务

触发词：`"openspec implement"`、`"apply change"`

1. 按 `tasks.md` 顺序逐项实施
2. 完成的任务标记 `[x]`
3. 全部完成后进入归档

### 第三步：归档变更

触发词：`"openspec archiving"`

1. 将 spec-delta 合并到 `openspec/specs/` 活规格文档
2. 移动整个变更目录到 `openspec/changes/archive/`
3. 更新 `tasks.md` 全部标记 `[x]`

### 例外情况

以下情况可以跳过 OpenSpec 流程：
- 纯文档修改（README、注释等）
- 紧急热修复（事后补提 proposal）
- 用户明确要求跳过

---

## 本地技能详细说明

### setup-skills — 技能初始化与 symlink 管理

**触发词**："初始化技能"、"链接技能"、"安装技能"、"删除技能"

| 命令 | 说明 |
|------|------|
| `node skills/setup-skills/setup-skills.js` | 为所有 Agent 创建技能 symlink |
| `... --status` | 查看 Agent 检测状态和已链接技能 |
| `... --init` | 初始化未检测的 Agent 目录 |
| `... --init --all` | 强制初始化所有支持的 Agent 目录 |
| `... --agent <name>` | 仅为指定 Agent 操作 |
| `... --clean` | 清除所有 symlink（不删源文件） |
| `... --clean-external` | 移除所有 skillfish 安装的外部技能 |
| `... --remove <skill>` | 移除指定技能（本地仅删链接，外部调 skillfish） |

### dev-verify — 开发验证

**触发词**："验证改动"、"看看效果"、"检查页面"

启动 dev server → Playwright 打开页面 → 检查控制台错误 → 输出报告。端口占用时自动复用已有服务。

### quick-fix — 快速修复

**触发词**："快速修复"、"hotfix"、"小 bug"

精简版 OpenSpec 流程：定位代码 → 生成最小 proposal（`fix-{描述}/`）→ 确认后修复 → dev-verify 验证 → 归档。

### test-gen — 测试生成

**触发词**："生成测试"、"写测试"

自动安装 Vitest + Testing Library，扫描组件生成测试文件到 `__tests__/`，运行并修复失败用例（不改源码）。

---

## Skillfish 命令参考

[skillfish](https://github.com/forztf/skillfish) 管理从 GitHub 仓库安装的外部技能，通过 `skillfish.json` 清单声明。

| 命令 | 说明 |
|------|------|
| `skillfish install --project -y` | 根据 `skillfish.json` 安装所有已声明技能 |
| `skillfish add <repo>/<skill-path>` | 从 GitHub 仓库安装技能到项目 |
| `skillfish bundle --project` | 扫描已安装技能，更新 `skillfish.json` 清单 |
| `skillfish remove <skill> --project --yes` | 移除已安装的技能 |
| `skillfish update` | 检查并更新已安装的技能 |
| `skillfish list` | 列出所有 Agent 中已安装的技能 |
| `skillfish search <query>` | 在注册表中搜索技能 |

> **`install` vs `bundle`**：`install` 从 JSON 读 → 写磁盘（拉取），`bundle` 从磁盘读 → 写 JSON（快照）。手动 `add` 技能后运行 `bundle` 即可同步清单。

---

## 目录结构

```
openspec/
├── config.yaml              # OpenSpec 配置（schema 类型、项目上下文）
├── specs/                   # 活规格文档（需求真相源）
│   ├── ai-chat/spec.md         ← 演示：AI 对话需求规格
│   └── date-display/spec.md    ← 演示：日期显示需求规格
└── changes/                 # 变更提案
    └── archive/             # 已归档（spec-delta 已合并到 specs/）

skills/                      # 本地技能源文件（symlink 来源）
├── setup-skills/               symlink 初始化脚本
├── dev-verify/                 开发验证
├── quick-fix/                  快速修复
└── test-gen/                   测试生成

.claude/skills/              # Claude Code 技能目录（本地 + 外部 symlink）
.codex/skills/               # Codex 技能目录
.gemini/skills/              # Gemini CLI 技能目录
.codebuddy/skills/           # CodeBuddy 技能目录

src/                         # ← 演示项目代码（替换为你的代码）
├── frontend/                   React + Vite 前端
└── backend/                    Express + OpenAI SDK 后端

CLAUDE.md                    # ← 必须修改：AI Agent 项目指南
AGENTS.md                    # 工作流强制规则（通用）
skillfish.json               # 外部技能清单（不用改）
```

---

## 常见问题

### Windows 创建 symlink 失败

开启开发者模式：**设置 → 系统 → 开发者选项 → 开发人员模式**。如果仍失败，脚本会自动尝试 `gsudo` 提权。

### skillfish 未安装

```bash
npm i -g skillfish
```

### 端口冲突

前端默认 `:5173`，后端默认 `:3001`。后端端口通过 `.env` 中的 `PORT` 修改，前端代理配置在 `src/frontend/vite.config.js`。

### 如何添加自定义技能

1. 在 `skills/` 下创建目录，编写 `SKILL.md`（含 frontmatter 和触发词）
2. 运行 `node skills/setup-skills/setup-skills.js` 创建 symlink
3. 所有 Agent 即可通过触发词使用

### 如何添加外部技能

```bash
skillfish add <github-repo>/<path-to-skill>
skillfish bundle --project    # 同步到 skillfish.json
```
