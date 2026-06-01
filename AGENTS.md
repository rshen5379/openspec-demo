# AGENTS.md — 最高准则

## 强制规则：所有代码修改必须遵循 OpenSpec 工作流

**每次修改代码之前，必须先通过 OpenSpec 创建或更新变更提案（proposal），获得批准后再实施。**

### 工作流程

1. **收到代码修改请求时**，使用 OpenSpec 技能创建 proposal：`/openspec-proposal-creation`
2. **Proposal 获得批准后**，使用 OpenSpec 技能实施任务：`/openspec-implementation`
3. **实施完成后**，使用 OpenSpec 技能归档变更：`/openspec-archiving`

### 技能名称对照表（禁止使用 /opsx 指令）

| 阶段 | 必须使用的技能名称 | 禁止使用的旧指令 |
|------|-------------------|-----------------|
| 创建提案 | `/openspec-proposal-creation` | ~~`/opsx:propose`~~ |
| 实施变更 | `/openspec-implementation` | ~~`/opsx:apply`~~ |
| 归档变更 | `/openspec-archiving` | ~~`/opsx:archive`~~ |
| 加载上下文 | `/openspec-context-loading` | — |
| 探索讨论 | `/openspec-explore` | ~~`/opsx:explore`~~ |

### 适用范围

此规则适用于所有代码修改，包括但不限于：
- 新功能开发
- Bug 修复
- UI 调整
- 重构
- 配置变更
- 样式修改

### 例外情况

以下情况可以不经过 OpenSpec 流程：
- 纯文档修改（README、注释等）
- 紧急热修复（事后必须补提 proposal）
- 用户明确要求跳过 OpenSpec 流程

### 效率技能（所有 Agent 通用）

以下技能定义在 `skills/` 文件夹，通过 `/斜杠命令` 触发。详细流程见各 `skills/{技能名}/SKILL.md`。

| 技能 | 触发词 | 说明 |
|------|--------|------|
| `dev-verify` | "验证改动"、"检查页面"、"看看效果" | 启动 dev server → 截图 → 检查控制台 → 输出报告 |
| `quick-fix` | "快速修复"、"小 bug"、"hotfix" | 简化 OpenSpec 流程，定位 Bug 并生成精简提案 |
| `test-gen` | "生成测试"、"写测试"、"添加测试" | 扫描 React 组件，自动生成 Vitest 测试 |
| `setup-skills` | "链接技能"、"symlink"、"删除技能"、"移除技能" | 管理 Agent 目录、创建/移除技能 symlink |

### 禁止行为

- 不得在没有 proposal 的情况下直接修改代码
- 不得跳过 tasks.md 中的任务检查项
- 不得在未归档的情况下开始新的变更

## 团队环境搭建

### 前置条件

安装 skillfish（AI 技能管理器，支持 33+ Agent）：

```bash
# 全局安装（推荐，可使用 list/update/bundle 等命令）
npm i -g skillfish

# 或免安装直接使用（仅支持 add 命令）
npx skillfish add owner/repo
```

### Clone 后一键初始化

```bash
npm run install:all                                    # 安装前后端依赖
skillfish install                                      # 安装外部技能（OpenSpec 等）
node skills/setup-skills/setup-skills.js --init        # 初始化 Agent 目录
node skills/setup-skills/setup-skills.js               # 为本地技能创建 symlink
```

### 外部技能（skillfish）

清单文件：`skillfish.json`（已提交 git）。

```bash
skillfish install          # 安装所有外部技能
skillfish add owner/repo   # 新增技能
skillfish bundle           # 更新清单
skillfish update           # 更新到最新版本
```

### 本地技能（`skills/`）

本地技能通过 `setup-skills` 技能管理（`/setup-skills`），详细用法见 `skills/setup-skills/SKILL.md`。

- 新增：在 `skills/` 下创建目录 + `SKILL.md`，然后重新运行 symlink
- 移除：`--remove` 只删 symlink 不删源文件
- Windows 需开启开发者模式

### 技能体系总览

| 类型 | 来源 | 安装方式 | 斜杠命令 |
|------|------|---------|---------|
| 外部技能 | skillfish (GitHub) | `skillfish install` | ✅ 直接可用 |
| 本地技能 | `skills/` 文件夹 | `setup-skills` 创建 symlink | ✅ 创建链接后可用 |
