#!/usr/bin/env node

/**
 * 本地技能多 Agent Symlink 初始化脚本
 *
 * 为 skills/ 中的每个技能，在所有已检测到的 Agent 目录下创建 symlink。
 * Claude Code 使用 commands/ 格式，其他 Agent 使用 skills/ 格式。
 *
 * 用法：
 *   node skills/setup-skills/setup-skills.js              # 为所有 Agent 创建技能链接
 *   node skills/setup-skills/setup-skills.js --init       # 初始化 Agent 目录（未检测到时自动触发）
 *   node skills/setup-skills/setup-skills.js --init --all # 强制初始化所有支持 Agent 的目录
 *   node skills/setup-skills/setup-skills.js --agent cursor  # 仅为指定 Agent 操作
 *   node skills/setup-skills/setup-skills.js --clean             # 清除所有 Agent 的技能链接
 *   node skills/setup-skills/setup-skills.js --clean-external    # 移除所有外部技能（skillfish）
 *   node skills/setup-skills/setup-skills.js --remove xxx # 删除技能（清除链接 + 删除目录）
 *   node skills/setup-skills/setup-skills.js --status     # 查看 Agent 和技能状态
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─── 配置 ──────────────────────────────────────────────
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const SKILLS_DIR = path.join(PROJECT_ROOT, 'skills');
const isWindows = process.platform === 'win32';
const isClean = process.argv.includes('--clean');
const isCleanExternal = process.argv.includes('--clean-external');
const isInit = process.argv.includes('--init');
const isInitAll = process.argv.includes('--all');
const isStatus = process.argv.includes('--status');

// 解析 --remove 参数
const removeArgIdx = process.argv.indexOf('--remove');
const removeTarget = removeArgIdx !== -1 ? process.argv[removeArgIdx + 1] : null;
const isRemove = removeArgIdx !== -1;

// 解析 --agent 参数
const agentArgIdx = process.argv.indexOf('--agent');
const filterAgent = agentArgIdx !== -1 ? process.argv[agentArgIdx + 1]?.toLowerCase() : null;

// Agent 配置
const AGENTS = [
  {
    name: 'Claude Code',
    baseDir: '.claude',
    skillsSubDir: 'commands',
    detect: ['.claude'],
    description: 'Anthropic 官方 CLI Agent',
  },
  {
    name: 'Cursor',
    baseDir: '.cursor',
    skillsSubDir: 'skills',
    detect: ['.cursor'],
    description: 'AI-first 代码编辑器',
  },
  {
    name: 'Codex',
    baseDir: '.codex',
    skillsSubDir: 'skills',
    detect: ['.codex'],
    description: 'OpenAI Codex CLI',
  },
  {
    name: 'GitHub Copilot',
    baseDir: '.github',
    skillsSubDir: 'skills',
    detect: ['.github'],
    description: 'GitHub Copilot Coding Agent',
  },
  {
    name: 'Gemini CLI',
    baseDir: '.gemini',
    skillsSubDir: 'skills',
    detect: ['.gemini'],
    description: 'Google Gemini CLI Agent',
  },
  {
    name: 'OpenCode',
    baseDir: '.opencode',
    skillsSubDir: 'skills',
    detect: ['.opencode'],
    description: 'OpenCode Agent',
  },
  {
    name: 'CodeBuddy',
    baseDir: '.codebuddy',
    skillsSubDir: 'skills',
    detect: ['.codebuddy'],
    description: 'CodeBuddy Agent',
  },
];

// ─── 工具函数 ──────────────────────────────────────────
function log(symbol, msg) {
  console.log(` ${symbol}  ${msg}`);
}

function getSkillNames() {
  if (!fs.existsSync(SKILLS_DIR)) {
    log('⚠', `skills/ 目录不存在: ${SKILLS_DIR}`);
    return [];
  }
  return fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

function linkExists(linkPath) {
  try {
    fs.lstatSync(linkPath);
    return true;
  } catch {
    return false;
  }
}

function isLink(linkPath) {
  try {
    return fs.lstatSync(linkPath).isSymbolicLink();
  } catch {
    return false;
  }
}

function agentMatchesFilter(agent) {
  if (!filterAgent) return true;
  return agent.name.toLowerCase().includes(filterAgent);
}

function isAgentDetected(agent) {
  return agent.detect.some(p => fs.existsSync(path.join(PROJECT_ROOT, p)));
}

function detectActiveAgents() {
  return AGENTS.filter(a => agentMatchesFilter(a) && isAgentDetected(a));
}

// ─── 查看状态 ──────────────────────────────────────────
function showStatus() {
  const skillNames = getSkillNames();
  console.log('  📋 Agent & 技能状态');
  console.log('');
  console.log(`  技能目录: ${skillNames.length > 0 ? skillNames.join(', ') : '(空)'}`);
  console.log('');

  for (const agent of AGENTS) {
    if (filterAgent && !agentMatchesFilter(agent)) continue;
    const detected = isAgentDetected(agent);
    const symbol = detected ? '🟢' : '⚪';
    const status = detected ? '已检测' : '未检测';
    const skillsDir = path.join(PROJECT_ROOT, agent.baseDir, agent.skillsSubDir);

    console.log(`  ${symbol} ${agent.name.padEnd(18)} ${status.padEnd(8)} ${agent.description}`);

    if (detected && fs.existsSync(skillsDir)) {
      const links = fs.readdirSync(skillsDir).filter(f => linkExists(path.join(skillsDir, f)));
      if (links.length > 0) {
        console.log(`     └─ ${agent.skillsSubDir}/: ${links.join(', ')}`);
      }
    }
  }
  console.log('');
  console.log('  提示: 运行 --init 初始化未检测的 Agent，--init --all 初始化全部');
}

// ─── 初始化 Agent 目录 ─────────────────────────────────
function initAgents() {
  console.log('  🛠  初始化 Agent 目录');
  console.log('');

  const targets = isInitAll
    ? AGENTS.filter(agentMatchesFilter)
    : AGENTS.filter(a => agentMatchesFilter(a) && !isAgentDetected(a));

  if (targets.length === 0) {
    log('ℹ', '所有 Agent 目录已存在，无需初始化。使用 --init --all 强制重建。');
    return;
  }

  let created = 0;
  for (const agent of targets) {
    const agentDir = path.join(PROJECT_ROOT, agent.baseDir);
    const skillsDir = path.join(agentDir, agent.skillsSubDir);

    // 创建 Agent 目录
    if (!fs.existsSync(agentDir)) {
      fs.mkdirSync(agentDir, { recursive: true });
      log('✔', `[${agent.name}] 创建 ${agent.baseDir}/`);
      created++;
    } else {
      log('·', `[${agent.name}] ${agent.baseDir}/ 已存在`);
    }

    // 创建 skills 子目录
    fs.mkdirSync(skillsDir, { recursive: true });
  }

  console.log('');
  if (created > 0) {
    log('✔', `初始化了 ${created} 个 Agent 目录`);
  }
  log('ℹ', '运行不带参数的 setup-skills.js 来创建技能链接');
}

// ─── 清除链接 ──────────────────────────────────────────
function cleanLinks() {
  const agents = detectActiveAgents();
  const skillNames = getSkillNames();
  let totalRemoved = 0;

  for (const agent of agents) {
    const dir = path.join(PROJECT_ROOT, agent.baseDir, agent.skillsSubDir);
    if (!fs.existsSync(dir)) continue;

    let removed = 0;
    for (const name of skillNames) {
      const linkPath = path.join(dir, name);
      if (linkExists(linkPath)) {
        try {
          if (isWindows) {
            execSync(`rmdir "${linkPath.replace(/\//g, '\\')}"`, { shell: 'cmd', stdio: 'pipe' });
          } else {
            fs.unlinkSync(linkPath);
          }
          removed++;
        } catch (err) {
          log('✖', `[${agent.name}] 删除失败: ${name} — ${err.message}`);
        }
      }
    }
    if (removed > 0) {
      log('✖', `[${agent.name}] 清理了 ${removed} 个链接`);
      totalRemoved += removed;
    }
  }

  if (totalRemoved === 0) {
    log('ℹ', '没有找到需要清理的链接');
  } else {
    log('✔', `共清理 ${totalRemoved} 个链接`);
  }
}

// ─── 清除所有外部技能 ────────────────────────────────────
function cleanExternalSkills() {
  const externalNames = getExternalSkillNames();

  if (externalNames.length === 0) {
    log('ℹ', 'skillfish.json 中没有外部技能');
    return;
  }

  console.log(`  🗑  清除所有外部技能 (${externalNames.length} 个): ${externalNames.join(', ')}`);
  console.log('');

  let removed = 0;
  let failed = 0;

  for (const name of externalNames) {
    try {
      execSync(`skillfish remove ${name} --project --yes`, {
        cwd: PROJECT_ROOT,
        stdio: 'pipe',
      });
      log('✔', `已移除: ${name}`);
      removed++;
    } catch (err) {
      log('✖', `移除失败: ${name} — ${err.message}`);
      failed++;
    }
  }

  console.log('');
  console.log('────────────────────────────');
  console.log(`  移除: ${removed}  失败: ${failed}`);
  console.log('────────────────────────────');
}

// ─── 删除技能 ──────────────────────────────────────────
function getExternalSkillNames() {
  const manifestPath = path.join(PROJECT_ROOT, 'skillfish.json');
  if (!fs.existsSync(manifestPath)) return [];
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    return (manifest.skills || []).map(s => {
      const parts = s.split('/');
      return parts[parts.length - 1];
    });
  } catch {
    return [];
  }
}

function isLocalSkill(name) {
  return fs.existsSync(path.join(SKILLS_DIR, name));
}

function isExternalSkill(name) {
  return getExternalSkillNames().includes(name);
}

function removeSkill(skillName) {
  if (!skillName) {
    log('⚠', '请指定要删除的技能名称，例如: --remove my-skill');
    const local = getSkillNames();
    const external = getExternalSkillNames();
    if (local.length > 0) log('ℹ', `本地技能: ${local.join(', ')}`);
    if (external.length > 0) log('ℹ', `外部技能: ${external.join(', ')}`);
    return;
  }

  const local = isLocalSkill(skillName);
  const external = isExternalSkill(skillName);

  if (!local && !external) {
    log('⚠', `技能 "${skillName}" 不存在`);
    const allLocal = getSkillNames();
    const allExternal = getExternalSkillNames();
    if (allLocal.length > 0) log('ℹ', `本地技能: ${allLocal.join(', ')}`);
    if (allExternal.length > 0) log('ℹ', `外部技能: ${allExternal.join(', ')}`);
    return;
  }

  console.log(`  🗑  移除技能链接: ${skillName}  (${local ? '本地' : ''}${local && external ? ' + ' : ''}${external ? '外部' : ''})`);
  console.log('');

  let linksRemoved = 0;
  const agents = AGENTS.filter(a => agentMatchesFilter(a) && isAgentDetected(a));

  // 1. 清除本地技能的 symlink（不删除 skills/ 源文件）
  if (local) {
    for (const agent of agents) {
      const dir = path.join(PROJECT_ROOT, agent.baseDir, agent.skillsSubDir);
      const linkPath = path.join(dir, skillName);

      if (linkExists(linkPath)) {
        try {
          if (isWindows) {
            execSync(`rmdir "${linkPath.replace(/\//g, '\\')}"`, { shell: 'cmd', stdio: 'pipe' });
          } else {
            fs.unlinkSync(linkPath);
          }
          log('  ✔', `[${agent.name}] 已移除链接`);
          linksRemoved++;
        } catch (err) {
          log('  ✖', `[${agent.name}] 移除失败: ${err.message}`);
        }
      }
    }
    log('ℹ', `skills/${skillName}/ 目录保留（仅移除链接）`);
  }

  // 2. 调用 skillfish 移除外部技能
  if (external) {
    try {
      execSync(`skillfish remove ${skillName} --project --yes`, {
        cwd: PROJECT_ROOT,
        stdio: 'pipe',
      });
      log('✔', `已通过 skillfish 移除: ${skillName}`);
    } catch (err) {
      log('⚠', `skillfish 移除失败: ${err.message}`);
      log('ℹ', `可手动执行: skillfish remove ${skillName} --project --yes`);
    }
  }

  console.log('');
  console.log('────────────────────────────');
  console.log(`  移除链接: ${linksRemoved}`);
  console.log('────────────────────────────');
}

// ─── 创建链接 ──────────────────────────────────────────
function createLinks() {
  const skillNames = getSkillNames();
  let agents = detectActiveAgents();

  // 如果没有检测到任何 Agent，提示初始化
  if (agents.length === 0) {
    log('⚠', '未检测到任何 Agent 目录！');
    console.log('');
    console.log('  可用的 Agent:');
    for (const agent of AGENTS) {
      console.log(`    ⚪ ${agent.name.padEnd(18)} ${agent.description}`);
    }
    console.log('');
    log('ℹ', '运行以下命令初始化:');
    log('→', 'node scripts/setup-skills.js --init        # 初始化所有');
    log('→', 'node scripts/setup-skills.js --init --agent claude  # 仅初始化指定 Agent');
    return;
  }

  if (skillNames.length === 0) {
    log('⚠', 'skills/ 下没有找到任何技能目录');
    return;
  }

  console.log(`  检测到 ${agents.length} 个 Agent: ${agents.map(a => a.name).join(', ')}`);
  console.log(`  找到 ${skillNames.length} 个技能: ${skillNames.join(', ')}`);
  console.log('');

  const stats = { created: 0, skipped: 0, failed: 0 };

  for (const agent of agents) {
    const targetDir = path.join(PROJECT_ROOT, agent.baseDir, agent.skillsSubDir);
    fs.mkdirSync(targetDir, { recursive: true });

    log('●', `${agent.name} → ${path.join(agent.baseDir, agent.skillsSubDir)}/`);

    for (const name of skillNames) {
      const linkPath = path.join(targetDir, name);
      const sourcePath = path.join(SKILLS_DIR, name);

      // 检查 SKILL.md
      if (!fs.existsSync(path.join(sourcePath, 'SKILL.md'))) {
        log('  ⚠', `跳过: ${name}（缺少 SKILL.md）`);
        stats.skipped++;
        continue;
      }

      // 已存在则跳过
      if (linkExists(linkPath)) {
        log('  ·', `已存在: ${name}`);
        stats.skipped++;
        continue;
      }

      try {
        if (isWindows) {
          const winLink = linkPath.replace(/\//g, '\\');
          const winTarget = sourcePath.replace(/\//g, '\\');
          execSync(`mklink /D "${winLink}" "${winTarget}"`, {
            shell: 'cmd',
            stdio: 'pipe',
          });
        } else {
          fs.symlinkSync(sourcePath, linkPath);
        }
        log('  ✔', `已创建: ${name}`);
        stats.created++;
      } catch (err) {
        log('  ✖', `失败: ${name} — ${err.message}`);
        if (isWindows && err.message.includes('权限')) {
          log('  ℹ', '提示: Windows 需开启"开发者模式"（设置 → 系统 → 开发者选项）');
        }
        stats.failed++;
      }
    }
    console.log('');
  }

  console.log('────────────────────────────');
  console.log(`  创建: ${stats.created}  跳过: ${stats.skipped}  失败: ${stats.failed}`);
  console.log('────────────────────────────');

  if (stats.failed > 0) {
    process.exit(1);
  }
}

// ─── 主流程 ────────────────────────────────────────────
console.log('');
console.log('  🔗 本地技能多 Agent Symlink 初始化');
console.log(`  系统: ${isWindows ? 'Windows' : process.platform}`);
if (filterAgent) console.log(`  过滤: ${filterAgent}`);
console.log('');

if (isStatus) {
  showStatus();
} else if (isRemove) {
  removeSkill(removeTarget);
} else if (isCleanExternal) {
  cleanExternalSkills();
} else if (isClean) {
  cleanLinks();
} else if (isInit) {
  initAgents();
} else {
  createLinks();
}
