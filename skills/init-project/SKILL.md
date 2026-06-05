# init-project

**触发词**："init project"、"new openspec"、"add openspec"、"setup openspec"、"initialize project"、"初始化项目"、"新建 openspec 项目"、"添加 openspec"

交互式引导用户通过两种路径使用 OpenSpec 模板：从零创建新项目（0→1）或为已有项目添加 OpenSpec（1→2）。

## 流程

1. **询问路径**：使用 AskUserQuestion 展示两个选项，让用户选择

   选项：
   - **Path A：从零创建新项目（0→1）** — 复制整个模板到新目录，删除演示代码，保留 OpenSpec 工作流和技能系统
   - **Path B：为已有项目添加 OpenSpec（1→2）** — 仅复制 6 个基座文件（openspec/、skills/、AGENTS.md、skillfish.json）到已有项目中

2. **询问目标路径**：根据用户选择的路径，询问必要信息：
   - Path A：需要**父目录路径**和**项目名称**
   - Path B：需要**已有项目的根目录路径**

3. **确认信息**：展示即将执行的操作摘要，请用户确认

4. **执行脚本**：
   ```bash
   # Path A
   node skills/init-project/init-project.js --path a --target "<父目录>" --name "<项目名>"

   # Path B
   node skills/init-project/init-project.js --path b --target "<项目根目录>"
   ```

5. **验证结果**：检查目标目录是否包含正确的文件结构

6. **输出后续步骤**：提示用户还需要手动完成的事项

## Path A 后续步骤

脚本完成后，告诉用户：

```
项目已创建！接下来需要：

1. cd <项目目录>
2. 将你的项目代码放入 src/（或其他目录）
3. 更新 package.json（name、scripts、dependencies）
4. 更新 CLAUDE.md（项目概述、开发命令、架构描述）
5. 更新 openspec/config.yaml（填入你的技术栈）
6. npm run setup:skills
```

## Path B 后续步骤

脚本完成后，告诉用户：

```
OpenSpec 基座已添加！接下来需要：

1. cd <项目目录>
2. 编辑 openspec/config.yaml（填入你的技术栈上下文）
3. 检查 CLAUDE.md 中追加的 OpenSpec 段落是否与项目匹配
4. npm run setup:skills
5. 在 openspec/specs/ 下创建第一个 spec
```

## 注意事项

- 脚本不会覆盖已存在的文件（跳过并提示）
- Path A 会删除演示代码（src/）和演示 spec 数据
- Path B 会清理 openspec/specs/ 中的演示数据
- 两种路径都会保留 skills/ 目录下的所有技能
- 目标路径支持 `~` 开头表示用户主目录
- Windows 路径分隔符会自动处理
