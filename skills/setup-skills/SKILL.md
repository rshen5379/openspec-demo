# setup-skills

**触发词**："初始化技能"、"symlink"、"setup skills"、"安装技能"、"链接技能"、"删除技能"、"移除技能"

初始化 Agent 目录、创建/移除技能 symlink。同时支持本地技能和外部技能（skillfish）。

## 流程

1. **查看状态**: 运行 `node skills/setup-skills/setup-skills.js --status`，展示已检测/未检测的 Agent 及已链接的技能
2. **初始化 Agent**: 如果有未检测的 Agent，运行 `node skills/setup-skills/setup-skills.js --init` 创建目录
3. **创建链接**: 运行 `node skills/setup-skills/setup-skills.js` 为所有 Agent 创建技能 symlink
4. **输出结果**: 汇报创建了多少链接、跳过了多少、是否有失败

## 用法变体

用户可能传入以下意图，按需执行对应命令：
- "查看状态"/"status" → `--status`
- "初始化"/"init" → `--init`
- "初始化全部" → `--init --all`
- "指定 Agent"（如 "cursor"、"copilot"）→ `--agent <name>`
- "清除全部链接"/"clean" → `--clean`
- "删除技能 xxx"/"移除技能 xxx" → `--remove xxx`
- 无明确意图 → 按上述完整流程依次执行

## 删除/移除技能流程

1. 运行 `node skills/setup-skills/setup-skills.js --remove <skill-name>`
2. 自动判断技能类型：
   - **本地技能**（`skills/` 下）：仅清除所有 Agent 中的 symlink，**不删除 `skills/` 源文件**
   - **外部技能**（skillfish 安装）：调用 `skillfish remove` 从 Agent 中移除
3. 输出移除结果

## 注意事项

- Windows 创建 symlink 需要开启开发者模式（设置 → 系统 → 开发者选项）
- 如果遇到权限错误，提示用户开启开发者模式或以管理员身份运行
- `--remove` 不会删除 `skills/` 目录下的源文件，只移除 symlink/注册
