#!/usr/bin/env node

/**
 * OpenSpec 项目初始化脚本
 *
 * 支持两种路径：
 *   Path A (0→1)：从模板创建全新项目
 *   Path B (1→2)：为已有项目添加 OpenSpec 基座
 *
 * 用法：
 *   node skills/init-project/init-project.js --path a --target <parent-dir> --name <project-name>
 *   node skills/init-project/init-project.js --path b --target <existing-project-path>
 *   node skills/init-project/init-project.js --help
 */

const fs = require('fs');
const path = require('path');

// ─── 常量 ──────────────────────────────────────────────
const isWindows = process.platform === 'win32';

// 需要排除的目录（Path A 复制时跳过）
const COPY_EXCLUSIONS = new Set([
  '.git',
  'node_modules',
  '.claude',
  '.codex',
  '.gemini',
  '.codebuddy',
  '_cc_temp',
  '.DS_Store',
  'Thumbs.db',
]);

// Path B 需要复制的文件/目录
const PATH_B_FILES = [
  { src: 'openspec', type: 'dir' },
  { src: 'skills', type: 'dir' },
  { src: 'AGENTS.md', type: 'file' },
  { src: 'skillfish.json', type: 'file' },
];

// ─── CLI 参数解析 ──────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  const result = { pathMode: null, target: null, name: null };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--path':
        result.pathMode = args[++i];
        break;
      case '--target':
        result.target = args[++i];
        break;
      case '--name':
        result.name = args[++i];
        break;
    }
  }

  return result;
}

function showHelp() {
  console.log(`
  OpenSpec 项目初始化脚本

  用法：
    Path A (从模板创建新项目):
      node skills/init-project/init-project.js --path a --target <parent-dir> --name <project-name>

    Path B (为已有项目添加 OpenSpec):
      node skills/init-project/init-project.js --path b --target <existing-project-path>

  参数：
    --path    路径选择：a (0→1 新建) 或 b (1→2 添加)
    --target  目标路径（Path A: 父目录; Path B: 已有项目根目录）
    --name    新项目名称（仅 Path A 需要）
    --help    显示帮助信息
  `);
}

// ─── 工具函数 ──────────────────────────────────────────
function log(symbol, msg) {
  console.log(` ${symbol}  ${msg}`);
}

function resolvePath(p) {
  return path.resolve(p.replace(/^~/, process.env.HOME || process.env.USERPROFILE));
}

/**
 * 递归复制目录，排除指定项
 */
function copyDirRecursive(src, dest, exclusions) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (exclusions && exclusions.has(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, exclusions);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * 复制单个文件
 */
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
}

/**
 * 清理演示数据
 */
function cleanDemoData(projectDir) {
  // 删除 src/ 目录
  const srcDir = path.join(projectDir, 'src');
  if (fs.existsSync(srcDir)) {
    fs.rmSync(srcDir, { recursive: true, force: true });
    log('✔', '已删除 src/ 演示代码');
  }

  // 清空 specs 目录内容
  const specsDir = path.join(projectDir, 'openspec', 'specs');
  if (fs.existsSync(specsDir)) {
    const specDirs = fs.readdirSync(specsDir, { withFileTypes: true });
    for (const d of specDirs) {
      if (d.isDirectory()) {
        fs.rmSync(path.join(specsDir, d.name), { recursive: true, force: true });
      }
    }
    log('✔', '已清空 openspec/specs/ 演示数据');
  }

  // 清空 archive 目录内容
  const archiveDir = path.join(projectDir, 'openspec', 'changes', 'archive');
  if (fs.existsSync(archiveDir)) {
    const archiveEntries = fs.readdirSync(archiveDir, { withFileTypes: true });
    for (const entry of archiveEntries) {
      fs.rmSync(path.join(archiveDir, entry.name), { recursive: true, force: true });
    }
    log('✔', '已清空 openspec/changes/archive/');
  }
}

/**
 * 更新 package.json 添加 setup:skills script
 */
function updatePackageJson(projectDir) {
  const pkgPath = path.join(projectDir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    log('⚠', '未找到 package.json，跳过 script 更新');
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  if (!pkg.scripts) pkg.scripts = {};

  if (!pkg.scripts['setup:skills']) {
    pkg.scripts['setup:skills'] =
      'node skills/setup-skills/setup-skills.js --init && skillfish install --project -y && node skills/setup-skills/setup-skills.js';
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    log('✔', '已添加 setup:skills script 到 package.json');
  } else {
    log('·', 'setup:skills script 已存在，跳过');
  }
}

/**
 * 追加 OpenSpec 段落到 CLAUDE.md
 */
function appendToClaudeMd(projectDir) {
  const claudeMdPath = path.join(projectDir, 'CLAUDE.md');
  const appendContent = `

## 强制规则（AGENTS.md）

**所有代码修改必须遵循 OpenSpec 工作流**，除非属于例外情况（纯文档、紧急热修复、用户明确跳过）。

流程：\`/openspec-proposal-creation\` → 用户批准 → \`/openspec-implementation\` → \`/openspec-archiving\`

## OpenSpec 结构

\`\`\`
openspec/
├── config.yaml       # 项目上下文
├── specs/            # 活规格文档（需求真相源）
└── changes/          # 变更提案
    └── archive/      # 已归档
\`\`\`

## 本地技能

| 技能 | 触发词 | 用途 |
|------|--------|------|
| \`dev-verify\` | "看看效果"、"验证改动" | 启动 dev server + 验证页面 |
| \`quick-fix\` | "快速修复"、"hotfix" | 精简 OpenSpec 修复 bug |
| \`test-gen\` | "生成测试" | 自动生成测试 |
| \`setup-skills\` | "初始化技能" | 安装依赖、创建 symlink |

## 代码修改定位参考

| 问题类型 | 关键文件 |
|----------|----------|
| （按你的项目填写） | |
`;

  if (!fs.existsSync(claudeMdPath)) {
    fs.writeFileSync(claudeMdPath, appendContent.trim() + '\n');
    log('✔', '已创建 CLAUDE.md（含 OpenSpec 段落）');
    return;
  }

  const content = fs.readFileSync(claudeMdPath, 'utf-8');
  if (content.includes('强制规则（AGENTS.md）')) {
    log('·', 'CLAUDE.md 已包含 OpenSpec 段落，跳过');
    return;
  }

  fs.writeFileSync(claudeMdPath, content.trimEnd() + appendContent);
  log('✔', '已追加 OpenSpec 段落到 CLAUDE.md');
}

/**
 * 追加 Agent 目录到 .gitignore
 */
function updateGitignore(projectDir) {
  const gitignorePath = path.join(projectDir, '.gitignore');
  const agentEntries = `
# AI Agent directories
.claude/
.codex/
.gemini/
.codebuddy/
`;

  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, agentEntries.trim() + '\n');
    log('✔', '已创建 .gitignore（含 Agent 目录忽略）');
    return;
  }

  const content = fs.readFileSync(gitignorePath, 'utf-8');
  if (content.includes('.claude/')) {
    log('·', '.gitignore 已包含 Agent 目录，跳过');
    return;
  }

  fs.writeFileSync(gitignorePath, content.trimEnd() + '\n' + agentEntries);
  log('✔', '已追加 Agent 目录到 .gitignore');
}

// ─── Path A：0 → 1 从模板创建新项目 ────────────────────
function executePathA(targetParent, projectName) {
  const templateDir = path.resolve(__dirname, '..', '..');
  const projectDir = path.join(targetParent, projectName);

  console.log('');
  console.log('  🚀 Path A: 从模板创建新项目');
  console.log(`  模板源: ${templateDir}`);
  console.log(`  目标:   ${projectDir}`);
  console.log('');

  // 检查目标目录
  if (fs.existsSync(projectDir)) {
    log('✖', `目标目录已存在: ${projectDir}`);
    process.exit(1);
  }

  // 1. 复制模板
  log('●', '复制模板文件...');
  copyDirRecursive(templateDir, projectDir, COPY_EXCLUSIONS);
  log('✔', `已复制到 ${projectDir}`);

  // 2. 清理演示数据
  console.log('');
  log('●', '清理演示数据...');
  cleanDemoData(projectDir);

  // 3. 初始化 git
  console.log('');
  log('●', '初始化 git 仓库...');
  try {
    const { execSync } = require('child_process');
    execSync('git init', { cwd: projectDir, stdio: 'pipe' });
    log('✔', '已初始化 git 仓库');
  } catch (err) {
    log('⚠', `git init 失败: ${err.message}`);
    log('ℹ', '请手动运行: git init');
  }

  // 4. 输出后续步骤
  console.log('');
  console.log('────────────────────────────────────────');
  console.log('  ✅ 项目创建完成！');
  console.log('────────────────────────────────────────');
  console.log('');
  console.log('  后续步骤：');
  console.log('');
  console.log(`  1. cd ${projectDir}`);
  console.log('  2. 将你的项目代码放入 src/（或其他目录）');
  console.log('  3. 更新 package.json（name、scripts、dependencies）');
  console.log('  4. 更新 CLAUDE.md（项目概述、开发命令、架构描述）');
  console.log('  5. 更新 openspec/config.yaml（填入你的技术栈）');
  console.log('  6. npm run setup:skills');
  console.log('');
}

// ─── Path B：1 → 2 为已有项目添加 OpenSpec ─────────────
function executePathB(targetDir) {
  const templateDir = path.resolve(__dirname, '..', '..');

  console.log('');
  console.log('  📦 Path B: 为已有项目添加 OpenSpec');
  console.log(`  模板源: ${templateDir}`);
  console.log(`  目标:   ${targetDir}`);
  console.log('');

  // 检查目标目录
  if (!fs.existsSync(targetDir)) {
    log('✖', `目标目录不存在: ${targetDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(path.join(targetDir, 'package.json'))) {
    log('⚠', '目标目录没有 package.json，请确认是有效的 Node.js 项目');
  }

  // 1. 复制基座文件
  log('●', '复制 OpenSpec 基座文件...');
  let copied = 0;

  for (const item of PATH_B_FILES) {
    const src = path.join(templateDir, item.src);
    const dest = path.join(targetDir, item.src);

    if (!fs.existsSync(src)) {
      log('⚠', `源文件不存在，跳过: ${item.src}`);
      continue;
    }

    // 跳过已存在的文件（不覆盖）
    if (fs.existsSync(dest)) {
      log('·', `已存在，跳过: ${item.src}`);
      continue;
    }

    if (item.type === 'dir') {
      copyDirRecursive(src, dest);
    } else {
      copyFile(src, dest);
    }
    log('✔', `已复制: ${item.src}`);
    copied++;
  }

  if (copied === 0) {
    log('ℹ', '所有基座文件已存在，无需复制');
  }

  // 2. 清理演示数据
  console.log('');
  log('●', '清理演示数据...');
  cleanDemoData(targetDir);

  // 3. 适配文件
  console.log('');
  log('●', '适配项目文件...');
  updatePackageJson(targetDir);
  appendToClaudeMd(targetDir);
  updateGitignore(targetDir);

  // 4. 输出后续步骤
  console.log('');
  console.log('────────────────────────────────────────');
  console.log('  ✅ OpenSpec 基座添加完成！');
  console.log('────────────────────────────────────────');
  console.log('');
  console.log('  后续步骤：');
  console.log('');
  console.log(`  1. cd ${targetDir}`);
  console.log('  2. 编辑 openspec/config.yaml（填入你的技术栈上下文）');
  console.log('  3. 检查 CLAUDE.md 中追加的 OpenSpec 段落是否与项目匹配');
  console.log('  4. npm run setup:skills');
  console.log('  5. 在 openspec/specs/ 下创建第一个 spec');
  console.log('');
}

// ─── 主流程 ────────────────────────────────────────────
const opts = parseArgs();

if (!opts.pathMode) {
  log('⚠', '请指定路径: --path a (0→1 新建) 或 --path b (1→2 添加)');
  console.log('运行 --help 查看详细用法');
  process.exit(1);
}

const target = opts.target ? resolvePath(opts.target) : null;

if (!target) {
  log('⚠', '请指定目标路径: --target <path>');
  process.exit(1);
}

if (opts.pathMode === 'a') {
  if (!opts.name) {
    log('⚠', 'Path A 需要指定项目名称: --name <project-name>');
    process.exit(1);
  }
  executePathA(target, opts.name);
} else if (opts.pathMode === 'b') {
  executePathB(target);
} else {
  log('✖', `未知路径: ${opts.pathMode}（可选: a 或 b）`);
  process.exit(1);
}
