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

### 例外情况

以下情况可以不经过 OpenSpec 流程：
- 纯文档修改（README、注释等）
- 紧急热修复（事后必须补提 proposal）
- 用户明确要求跳过 OpenSpec 流程

### 效率技能

通过 `/斜杠命令` 触发，详细流程见各 `skills/{技能名}/SKILL.md`。

| 技能 | 触发词 |
|------|--------|
| `dev-verify` | "验证改动"、"检查页面"、"看看效果" |
| `quick-fix` | "快速修复"、"小 bug"、"hotfix" |
| `test-gen` | "生成测试"、"写测试"、"添加测试" |
| `setup-skills` | "链接技能"、"symlink"、"删除技能"、"移除技能" |

### tasks.md 格式规范（强制）

```markdown
## 1. 分组标题

- [ ] 1.1 具体任务描述
- [x] 1.2 已完成的任务

## N. 验证

- [ ] N.1 验证任务
```

**规则**：
- 分组标题使用 `## N. 标题` 格式（连续数字）
- 任务项使用 `- [ ] N.M 描述` checkbox 格式
- 最后一个分组必须是验证任务

### 禁止行为

- 不得在没有 proposal 的情况下直接修改代码
- 不得跳过 tasks.md 中的任务检查项
- 不得在未归档的情况下开始新的变更
- 不得生成不符合格式规范的 tasks.md
