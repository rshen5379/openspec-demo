## Why

当前点击遮罩层（overlay backdrop）会关闭对话框，容易导致用户误触丢失正在进行的对话。用户希望仅通过明确的关闭按钮或 ESC 键关闭对话框，防止意外关闭。

## What Changes

- 移除遮罩层的 onClick 关闭行为
- 保留 ESC 键和关闭按钮（✕）两种关闭方式不变

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `ai-chat`: Chat UI Layout 中 Close modal dialog 场景，移除 overlay backdrop 点击关闭行为

## Impact

- 前端：修改 `src/frontend/src/App.jsx` 中遮罩层 div 的 onClick 处理
- 无后端变更
