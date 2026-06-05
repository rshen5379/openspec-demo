# 模板使用指南

本文档面向 **0→1 和 1→2 的开发者**，详细说明两种使用此项目的方式。

> **💡 快速开始**：如果你使用 AI Agent（Claude Code / Codex / Gemini CLI / CodeBuddy），直接对 Agent 说 **"init project"** 或 **"初始化项目"**，Agent 会通过 `init-project` 技能交互式引导你完成设置，自动执行下方文档中的步骤。

---

## 两种路径

```
路径 A: 0 → 1（从零开始）              路径 B: 1 → 2（引入 OpenSpec）
┌─────────────────────────────┐      ┌──────────────────────────────────┐
│ 复制整个模板                  │      │ 已有项目，挑选文件加入             │
│ 删演示代码，写自己的代码       │      │ 现有代码不动，叠加 OpenSpec 层    │
│ 适合：还没有项目              │      │ 适合：已有运行中的项目            │
│ 需要的文件：全部              │      │ 需要的文件：6 个                  │
└─────────────────────────────┘      └──────────────────────────────────┘
```

---

## 路径 A：0 → 1 从零创建新项目

### 这个模板提供了什么

| 组件 | 说明 | 你需要做什么 |
|------|------|-------------|
| OpenSpec 工作流 | proposal → implement → archive 三步变更管理 | 不用改，直接用 |
| 外部技能 | `openspec-proposal-creation` 等 4 个 skillfish 技能 | 不用改，直接用 |
| 本地技能 | `setup-skills`、`dev-verify`、`quick-fix`、`test-gen` | 按需保留或修改 |
| 多 Agent symlink | 自动分发技能到 Claude Code / Codex / Gemini CLI / CodeBuddy | 不用改，直接用 |
| AGENTS.md | 工作流强制规则 | 不用改（通用） |
| 演示代码 | `src/` 下的 AI 对话应用 | **删除，替换为你的代码** |
| CLAUDE.md | 项目描述和架构 | **必须修改** |
| openspec/config.yaml | OpenSpec 项目上下文 | **必须修改** |
| openspec/specs/ | 演示需求规格 | **删除，创建你自己的** |

### Step 1：创建你的项目

```bash
# 复制模板
cp -r openspec-demo my-project
cd my-project

# 初始化你自己的 git 仓库
rm -rf .git
git init
git add -A
git commit -m "init: from openspec-demo template"
```

### Step 2：删除演示代码

```bash
# 删除演示业务代码
rm -rf src/

# 清空演示 OpenSpec 数据
rm -rf openspec/specs/*/
rm -rf openspec/changes/archive/*

# 保留空的目录结构
mkdir -p openspec/specs openspec/changes/archive
```

> 💡 **如果你想保留演示作为参考**：不删 `openspec/changes/archive/`，里面的归档变更展示了各种 proposal/tasks/spec-delta 格式。

### Step 3：放入你自己的代码

将你的项目代码放入 `src/`（或其他目录），确保：
- 有 `package.json`
- 有启动/构建命令

更新根 `package.json` 的 scripts 以匹配你的项目：

```json
{
  "name": "your-project",
  "scripts": {
    "dev": "...",
    "build": "...",
    "install:all": "...",
    "setup:skills": "node skills/setup-skills/setup-skills.js --init && skillfish install --project -y && node skills/setup-skills/setup-skills.js"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

### Step 4：修改 CLAUDE.md

搜索所有 `<!-- TODO -->` 注释，逐个替换：

1. **项目概述** — 一句话描述你的项目
2. **开发命令** — 你的 `npm run` 命令
3. **架构** — 你的代码结构、技术栈、关键文件
4. **代码修改定位参考** — 按问题类型列出关键文件路径的对照表

> 这一步至关重要。CLAUDE.md 是 AI Agent 理解你项目的入口，写得越清楚，Agent 工作越准确。

### Step 5：修改 openspec/config.yaml

填入项目上下文，帮助 OpenSpec 技能理解你的技术栈：

```yaml
schema: spec-driven
context: |
  Tech stack: Next.js 14 + TypeScript + Tailwind CSS + PostgreSQL
  Language: TypeScript (strict mode)
  ORM: Prisma
  Auth: NextAuth.js
  API: Next.js API Routes (App Router)
  Conventions: Conventional commits, ESLint + Prettier
```

### Step 6：初始化技能

```bash
# 1. 安装你项目的依赖
npm install

# 2. 初始化 Agent 目录 + 安装外部技能 + 创建 symlink
npm run setup:skills
# 或者分步执行：
#   node skills/setup-skills/setup-skills.js --init
#   skillfish install --project -y
#   node skills/setup-skills/setup-skills.js
```

### Step 7：创建第一个 spec

对 Agent 说你的第一个需求，例如：

> "我想添加用户登录功能"

Agent 会自动触发 `/openspec-proposal-creation`，在 `openspec/changes/` 下创建提案。

或者你也可以手动创建第一个 spec：

```bash
mkdir -p openspec/specs/authentication
```

然后编写 `openspec/specs/authentication/spec.md`：

```markdown
# Authentication

### Requirement: User Login
WHEN a user submits valid credentials,
the system SHALL authenticate the user and create a session.

#### Scenario: Successful Login
GIVEN a registered user with email "user@example.com"
WHEN the user submits the login form with correct password
THEN the system creates an authenticated session
AND redirects to the dashboard
```

---

## 路径 B：1 → 2 已有项目引入 OpenSpec

### 前提

你已有一个运行中的项目，想要：
- 用 spec-driven 方式管理变更（而非直接让 Agent 改代码）
- 让 AI Agent 遵循规范化流程（proposal → approve → implement → archive）
- 为需求建立"活规格文档"作为真相源

### 你需要的最小文件集

只需 6 个文件/目录：

```
openspec/          变更管理框架（目录）
├── config.yaml       项目上下文
├── specs/            活规格目录（空）
└── changes/
    └── archive/      归档目录（空）

skills/            本地技能（目录）
AGENTS.md          工作流强制规则
skillfish.json     外部技能清单
```

**不需要复制**：`src/`、`CLAUDE.md`（你已有）、`package.json`（你已有）、`.gitignore`（你已有）

### Step 1：复制基座文件

```bash
# 在你的项目根目录执行（替换 <openspec-demo-path> 为模板实际路径）
cp -r <openspec-demo-path>/openspec   ./openspec
cp -r <openspec-demo-path>/skills     ./skills
cp    <openspec-demo-path>/AGENTS.md  ./AGENTS.md
cp    <openspec-demo-path>/skillfish.json ./skillfish.json
```

复制后的项目结构：

```
你的项目/
├── openspec/              ← 新增
│   ├── config.yaml
│   ├── specs/
│   └── changes/archive/
├── skills/                ← 新增
│   ├── setup-skills/
│   ├── dev-verify/
│   ├── quick-fix/
│   └── test-gen/
├── AGENTS.md              ← 新增
├── skillfish.json         ← 新增
│
├── src/                   ← 你的代码（不动）
├── package.json           ← 你的（小改即可）
├── CLAUDE.md              ← 你的（需要追加内容）
└── ...
```

### Step 2：清理演示数据

```bash
# 删除演示 spec 和归档（这些不是你的项目）
rm -rf openspec/specs/ai-chat openspec/specs/date-display
rm -rf openspec/changes/archive/*
```

### Step 3：适配 4 个文件

**1. `openspec/config.yaml`** — 填入你的项目上下文：

```yaml
schema: spec-driven
context: |
  Tech stack: Next.js 14 + TypeScript + Tailwind CSS + PostgreSQL
  Language: TypeScript (strict mode)
  ORM: Prisma
  API: Next.js API Routes (App Router)
  Conventions: Conventional commits, ESLint + Prettier
```

**2. `CLAUDE.md`** — 在你现有的 CLAUDE.md 中**追加**以下段落（不要覆盖现有内容）：

```markdown
## 强制规则（AGENTS.md）

**所有代码修改必须遵循 OpenSpec 工作流**，除非属于例外情况（纯文档、紧急热修复、用户明确跳过）。

流程：`/openspec-proposal-creation` → 用户批准 → `/openspec-implementation` → `/openspec-archiving`

## OpenSpec 结构

openspec/
├── config.yaml       # 项目上下文
├── specs/            # 活规格文档（需求真相源）
└── changes/          # 变更提案
    └── archive/      # 已归档

## 本地技能

| 技能 | 触发词 | 用途 |
|------|--------|------|
| `dev-verify` | "看看效果"、"验证改动" | 启动 dev server + 验证页面 |
| `quick-fix` | "快速修复"、"hotfix" | 精简 OpenSpec 修复 bug |
| `test-gen` | "生成测试" | 自动生成测试 |
| `setup-skills` | "初始化技能" | 安装依赖、创建 symlink |

## 代码修改定位参考

| 问题类型 | 关键文件 |
|----------|----------|
| （按你的项目填写） | |
```

**3. `package.json`** — 追加一个 script：

```json
{
  "scripts": {
    "...": "你现有的 scripts",
    "setup:skills": "node skills/setup-skills/setup-skills.js --init && skillfish install --project -y && node skills/setup-skills/setup-skills.js"
  }
}
```

> 如果你的项目没有 `concurrently` 依赖，安装一下：`npm install -D concurrently`

**4. `.gitignore`** — 追加 Agent 目录忽略：

```gitignore
# AI Agent directories
.claude/
.codex/
.gemini/
.codebuddy/
.playwright-cli/
```

### Step 4：初始化技能

```bash
npm run setup:skills
```

这会自动执行三件事：初始化 Agent 目录 → 安装外部技能 → 创建 symlink。

### Step 5：编写第一个 spec

为你的项目创建第一个活规格文档，从最核心的功能开始：

```bash
mkdir -p openspec/specs/user-management
```

```markdown
<!-- openspec/specs/user-management/spec.md -->

# User Management

### Requirement: User Registration
WHEN a new user submits the registration form with valid data,
the system SHALL create an account and send a verification email.

#### Scenario: Successful Registration
GIVEN no existing user with email "new@example.com"
WHEN the user submits registration with email and password
THEN the system creates a new user record
AND sends a verification email
```

### Step 6：开始使用

对 Agent 说你的第一个变更需求。Agent 会读取 `AGENTS.md`，自动走 OpenSpec 流程。

> 💡 **核心理解**：OpenSpec 是一层"管理框架"叠加在项目之上，不需要改动任何现有代码。它通过 `AGENTS.md` 约束 Agent 行为，通过 `openspec/specs/` 建立需求真相源。

### 已有项目引入 OpenSpec 的注意事项

| 问题 | 解决 |
|------|------|
| 已有 `.claude/` 目录 | 正常——`setup-skills.js` 会在现有 `.claude/skills/` 下添加 symlink，不冲突 |
| 已有 `CLAUDE.md` | **追加** OpenSpec 段落，不要覆盖你现有的内容 |
| 已有 `.gitignore` | 追加忽略规则，避免 Agent 目录被提交 |
| `dev-verify` 不适用我的项目 | 删除 `skills/dev-verify/`，或修改其中端口/等待文本 |
| `quick-fix` 的代码定位不准 | 修改 `skills/quick-fix/SKILL.md` 中的文件定位表 |
| `test-gen` 针对的是 React | 如果你的项目不是 React，删除 `skills/test-gen/` 或改写 |
| 只想用 `setup-skills` | 可以。其他 3 个本地技能都是可选的便利工具 |
| 项目是 Python / Go / 其他语言 | 完全可以。OpenSpec 工作流与语言无关。只需修改 `config.yaml` 和 `CLAUDE.md` 的描述 |

---

## 本地技能适配

模板自带的 4 个本地技能中，`setup-skills` 是必须的，其他 3 个是可选的便利工具。

### setup-skills — 必须，通用

安装依赖 + 初始化 Agent 目录 + 创建 symlink。与项目技术栈无关，不用改。

### dev-verify — 可选，可能需要调整

默认检查 `http://localhost:5173` 并等待"欢迎"文本。如果你的项目：
- 使用不同端口 → 修改 `skills/dev-verify/SKILL.md` 中的 URL
- 使用不同框架 → 调整等待的页面文本
- 无前端界面 → 删除这个技能

### quick-fix — 可选，可能需要调整

默认的代码定位表基于演示项目。修改 `skills/quick-fix/SKILL.md` 中的定位逻辑以匹配你的项目结构。

### test-gen — 可选，可能需要调整

默认针对 React + Vitest。如果你使用：
- Vue / Svelte → 调整组件扫描逻辑和 Testing Library
- Jest → 修改为 Jest 配置
- 无前端 / 不需要自动测试 → 删除这个技能

### 添加你自己的技能

```bash
# 1. 创建技能目录
mkdir -p skills/my-custom-skill

# 2. 编写 SKILL.md
cat > skills/my-custom-skill/SKILL.md << 'EOF'
---
name: my-custom-skill
description: 做某件事的技能
---

# My Custom Skill

**触发词**："触发词1"、"触发词2"

（技能的具体流程描述）
EOF

# 3. 创建 symlink（分发到所有 Agent）
node skills/setup-skills/setup-skills.js
```

---

## OpenSpec 工作流速查

### 日常开发循环

```
你对 Agent 说一个需求
        ↓
Agent 自动创建 proposal（openspec/changes/xxx/）
        ↓
你审阅 proposal，说"批准"或提出修改意见
        ↓
Agent 按 tasks.md 逐项实施，每完成一项标记 [x]
        ↓
全部完成后 Agent 归档变更
        ↓
spec-delta 合并到 openspec/specs/（活规格更新）
        ↓
继续下一个需求
```

### 快捷方式

| 你说的话 | Agent 做什么 |
|----------|-------------|
| "添加 XXX 功能" | 触发 proposal 创建流程 |
| "批准" / "开始实施" | 触发 implementation |
| "看看效果" | 触发 dev-verify（启动服务 + 检查） |
| "快速修复 XXX bug" | 触发 quick-fix（精简流程） |
| "生成测试" | 触发 test-gen |

### 文件格式规范

**tasks.md**（必须遵循）：
```markdown
## 1. 分组标题

- [ ] 1.1 具体任务描述
- [x] 1.2 已完成的任务

## 2. 验证

- [ ] 2.1 验证任务
```

规则：
- 分组标题用 `## N. 标题`（连续数字）
- 任务项用 `- [ ] N.M 描述`（checkbox）
- 最后一个分组必须是验证

**spec-delta.md**（EARS 格式）：
```markdown
## ADDED Requirements

### Requirement: 功能名称
WHEN 条件,
the system SHALL 期望行为.

#### Scenario: 场景名称
GIVEN 前置条件
WHEN 触发动作
THEN 期望结果
```

---

## 多 Agent 环境说明

模板支持以下 AI Agent：

| Agent | 目录 | 说明 |
|-------|------|------|
| Claude Code | `.claude/` | Anthropic 官方 CLI |
| Codex | `.codex/` | OpenAI Codex CLI |
| Gemini CLI | `.gemini/` | Google Gemini CLI |
| CodeBuddy | `.codebuddy/` | CodeBuddy |

`setup-skills.js` 会：
1. 检测哪些 Agent 目录存在
2. 为每个 Agent 的 `skills/` 子目录创建 symlink → 指向 `skills/` 和 skillfish 安装的技能

**如果你只使用一个 Agent**：没问题，只有该 Agent 的目录会被检测到，其他 Agent 的目录不会被创建。

**Windows 注意事项**：
- 需要开启开发者模式（设置 → 系统 → 开发者选项）
- 使用 junction link（`mklink /J`），不要求管理员权限
- 如果失败，脚本会自动尝试 `gsudo` 提权

---

## 常见问题

### 我不想用 React，能用 Vue/其他框架吗？

可以。`src/` 目录与 OpenSpec 基座完全解耦。删除 `src/`，放入你自己的代码，然后更新 CLAUDE.md 和 config.yaml。

### 我的项目没有前后端分离，能用吗？

可以。OpenSpec 工作流不关心你的项目结构。你只需要确保 CLAUDE.md 中准确描述了你的项目。

### 我只想用 Claude Code，不想支持多 Agent

可以。不运行 `--init`，只保留 `.claude/` 目录即可。skillfish 默认也是安装到 `.claude/` 下。

### 我可以不用 skillfish，手动管理技能吗？

可以。`skillfish.json` 和 `skillfish install` 只是为了方便从 GitHub 安装外部技能。你可以：
1. 手动下载技能到 `.claude/skills/`
2. 只使用 `skills/` 下的本地技能 + `setup-skills.js` 的 symlink

### 归档目录可以删除吗？

可以。`openspec/changes/archive/` 只是历史记录，删除不影响任何功能。活规格（`openspec/specs/`）才是需求真相源。

### 我可以修改 AGENTS.md 中的规则吗？

可以，但建议保留 OpenSpec 工作流的核心三步规则。你可以：
- 调整例外情况
- 添加项目特有的编码规范
- 修改本地技能触发词表

### 1→2：OpenSpec 会影响我现有的 git 工作流吗？

不会。OpenSpec 只是在项目中增加了 `openspec/` 目录和 `AGENTS.md` 文件，不改变你的分支策略、CI/CD 或部署流程。`openspec/changes/archive/` 中的文件会随着 git 提交自然保留历史。

### 1→2：已有项目的 spec 怎么写？

不需要一步到位为所有功能补写 spec。推荐渐进方式：

1. **新功能**：先走 OpenSpec 流程（proposal → spec-delta → implement → archive），spec 自然积累
2. **已有功能**：在需要修改时，先为该功能补写一个 spec，再走变更流程
3. **不碰的功能**：不需要写 spec

目标是让 `openspec/specs/` 逐渐成为完整的需求文档，而不是要求一次性补全。

### 1→2：团队中其他人不用 AI Agent，能用 OpenSpec 吗？

可以。`openspec/specs/` 中的 Given/When/Then 规格文档是人类可读的需求文档，不依赖 AI Agent。团队成员可以：
- 手动阅读 spec 了解需求
- 手动创建 proposal（按 `proposal.md` 格式）
- 在 code review 时参照 spec 审查

AI Agent 只是让这个过程更自动化，不是必须的。
