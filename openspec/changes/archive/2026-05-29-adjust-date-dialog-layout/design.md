## Context

日期显示最初放在页面内容流中（标题上方居中），与页面标题视觉冲突。对话框曾被改为右侧面板以避免遮挡，但用户要求保持居中弹窗模式。

## Goals / Non-Goals

**Goals:**
- 日期固定在页面右上角，不占用内容流空间
- 对话框保持居中弹窗，带遮罩层和弹出动画

**Non-Goals:**
- 不改变日期格式化逻辑
- 不改变对话框交互功能

## Decisions

- DateDisplay 使用 `position: fixed; top: 16px; right: 24px` 固定在右上角
- 主布局恢复为单列非 flex 模式，对话框用 fixed + transform 居中

## Risks / Trade-offs

- 日期在小屏幕上可能与对话框边缘接近，但 z-index 设为 100（低于对话框的 1001），不影响交互
